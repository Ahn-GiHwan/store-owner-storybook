import { io } from 'socket.io-client';
import * as Sentry from '@sentry/vue';
import logger from '@/plugins/vueLogger';

import { useAuthStore } from '@/stores';
import { SOCKET, STORE_STATUS, STORE_USER_STATUS } from '@/constants';

const WS_HOST = import.meta.env.VITE_APP_BASE_WS_URL;

class StoreSocketManager {
  #socket = {};

  #eventHandlerMap = new Map();

  constructor() {
    Object.values(SOCKET.EVENT).forEach((event) => {
      this.#eventHandlerMap.set(event, new Set());
    });
  }

  connect(token, room) {
    Object.values(SOCKET.NAMESPACE).forEach((namespace) => {
      if (namespace === SOCKET.NAMESPACE.ORDER_INFO) {
        // 주문 정보 소켓의 경우 상점과 상점유저가 존재하고 모두 승인상태 일 때에만 join 하도록 함
        const auth = useAuthStore();

        if (!(auth.currentStore && auth.currentStore.status === STORE_STATUS.APPROVED &&
          auth.currentStoreUser && auth.currentStoreUser.status === STORE_USER_STATUS.APPROVED)) {
          return;
        }
      }

      this.#socket[namespace] = io(`${WS_HOST}/${namespace}`, {
        path: '/gorela/',
        transports: ['websocket'],
        query: {
          authorization: `Bearer ${token}`,
        },
        // reconnect attempt 1000 > 2000 > 4000 > 5000 > 5000
        // 재연결 delay 1초 후 -> 2초 후 -> 4초 후 > 5초 후 > 5초 후 > ... (무한대)
        reconnection: true, // default: true
        reconnectionDelay: 1000, // default: 1000
        reconnectionDelayMax: 5000, // default: 5000
        // reconnectionAttempts: 50, // default: Infinity
      });

      try {
        this.#socket[namespace].on('connect', () => {
          this.#socket[namespace].emit('ROOM_JOIN', { room });
          logger.info(`[${namespace}] connected (room:${room})`);
        });
      } catch (err) {
        logger.info(err);
      }

      this.#socket[namespace].io.on('reconnect_attempt', (attempt) => {
        logger.info(`[${namespace}] reconnect_attempt ${attempt}`);

        // 대략 5분정도 재연결 실패 시 에러 전송 (sentry에서 확인을 위함)
        if (attempt % 60 === 0) {
          Sentry.captureException(new Error(`[${namespace}] reconnect_attempt ${attempt}`));
        }
      });

      this.#socket[namespace].io.on('reconnect', () => {
        logger.info(`[${namespace}] reconnected`);
      });

      this.#socket[namespace].io.on('reconnect_error', (error) => {
        logger.error(`[${namespace}] reconnect_error: ${error.message}`, error);
      });

      this.#socket[namespace].on('disconnect', (reason) => {
        logger.info(`[${namespace}] disconnected: ${reason}`);
      });

      this.#socket[namespace].on('connect_error', (error) => {
        logger.error(`[${namespace}] error: ${error.message}`);
      });

      SOCKET.NAMESPACE_EVENTS[namespace].forEach((event) => {
        this.#socket[namespace].on(event, (message) => {
          this.#eventHandlerMap.get(event).forEach((eventHandler) => {
            eventHandler(message);
          });
        });
      });
    });
  }

  get isConnected() {
    return !Object.values(SOCKET.NAMESPACE)
      .some((namespace) => !this.#socket[namespace]?.connected);
  }

  subscribe(event, eventHandler) {
    try {
      const eventHandlerSet = this.#eventHandlerMap.get(event);
      eventHandlerSet.add(eventHandler);
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  // 등록된 이벤트 핸들러 제거
  unsubscribe(event, eventHandler) {
    try {
      const eventHandlerSet = this.#eventHandlerMap.get(event);
      eventHandlerSet.delete(eventHandler);
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  disconnect() {
    Object.values(SOCKET.NAMESPACE).forEach((namespace) => {
      if (this.#socket[namespace]) {
        this.#socket[namespace].disconnect();
        this.#socket[namespace] = undefined;
      }
    });
  }
}

export default new StoreSocketManager();
