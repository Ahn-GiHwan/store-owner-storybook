<template>
  <img class="order-agency-icon"
    :srcset="`${iconSet[0]} 1x, ${iconSet[1]} 2x, ${iconSet[2]} 3x`"
    :src="iconSet[0]"
    alt="주문제휴사 아이콘" />
</template>
<script>
import { computed, defineComponent } from 'vue';
import _13mile2x from '@/assets/images/icon/order/logo_order_13mile_2x.png';
import _13mile3x from '@/assets/images/icon/order/logo_order_13mile_3x.png';
import _13mile from '@/assets/images/icon/order/logo_order_13mile.png';
import admin2x from '@/assets/images/icon/order/logo_order_admin_2x.png';
import admin3x from '@/assets/images/icon/order/logo_order_admin_3x.png';
import admin from '@/assets/images/icon/order/logo_order_admin.png';
import ainopos2x from '@/assets/images/icon/order/logo_order_ainopos_2x.png';
import ainopos3x from '@/assets/images/icon/order/logo_order_ainopos_3x.png';
import ainopos from '@/assets/images/icon/order/logo_order_ainopos.png';
import amoreAritaum2x from '@/assets/images/icon/order/logo_order_amore_aritaum_2x.png';
import amoreAritaum3x from '@/assets/images/icon/order/logo_order_amore_aritaum_3x.png';
import amoreAritaum from '@/assets/images/icon/order/logo_order_amore_aritaum.png';
import angelinus2x from '@/assets/images/icon/order/logo_order_angelinus_2x.png';
import angelinus3x from '@/assets/images/icon/order/logo_order_angelinus_3x.png';
import angelinus from '@/assets/images/icon/order/logo_order_angelinus.png';
import angelsoft2x from '@/assets/images/icon/order/logo_order_angelsoft_2x.png';
import angelsoft3x from '@/assets/images/icon/order/logo_order_angelsoft_3x.png';
import angelsoft from '@/assets/images/icon/order/logo_order_angelsoft.png';
import baechelin2x from '@/assets/images/icon/order/logo_order_baechelin_2x.png';
import baechelin3x from '@/assets/images/icon/order/logo_order_baechelin_3x.png';
import baechelin from '@/assets/images/icon/order/logo_order_baechelin.png';
import baegofa2x from '@/assets/images/icon/order/logo_order_baegofa_2x.png';
import baegofa3x from '@/assets/images/icon/order/logo_order_baegofa_3x.png';
import baegofa from '@/assets/images/icon/order/logo_order_baegofa.png';
import baemin2x from '@/assets/images/icon/order/logo_order_baemin_2x.png';
import baemin3x from '@/assets/images/icon/order/logo_order_baemin_3x.png';
import baeminDelivery2x from '@/assets/images/icon/order/logo_order_baemin_delivery_2x.png';
import baeminDelivery3x from '@/assets/images/icon/order/logo_order_baemin_delivery_3x.png';
import baeminDelivery from '@/assets/images/icon/order/logo_order_baemin_delivery.png';
import baemin from '@/assets/images/icon/order/logo_order_baemin.png';
import barogoHq2x from '@/assets/images/icon/order/logo_order_barogo_hq_2x.png';
import barogoHq3x from '@/assets/images/icon/order/logo_order_barogo_hq_3x.png';
import barogoHq from '@/assets/images/icon/order/logo_order_barogo_hq.png';
import barogoHub2x from '@/assets/images/icon/order/logo_order_barogo_hub_2x.png';
import barogoHub3x from '@/assets/images/icon/order/logo_order_barogo_hub_3x.png';
import barogoHub from '@/assets/images/icon/order/logo_order_barogo_hub.png';
import barogoStore2x from '@/assets/images/icon/order/logo_order_barogo_store_2x.png';
import barogoStore3x from '@/assets/images/icon/order/logo_order_barogo_store_3x.png';
import barogoStore from '@/assets/images/icon/order/logo_order_barogo_store.png';
import beyondpos2x from '@/assets/images/icon/order/logo_order_beyondpos_2x.png';
import beyondpos3x from '@/assets/images/icon/order/logo_order_beyondpos_3x.png';
import beyondpos from '@/assets/images/icon/order/logo_order_beyondpos.png';
import bgfretail2x from '@/assets/images/icon/order/logo_order_bgfretail_2x.png';
import bgfretail3x from '@/assets/images/icon/order/logo_order_bgfretail_3x.png';
import bgfretail from '@/assets/images/icon/order/logo_order_bgfretail.png';
import bhc2x from '@/assets/images/icon/order/logo_order_bhc_2x.png';
import bhc3x from '@/assets/images/icon/order/logo_order_bhc_3x.png';
import bhc from '@/assets/images/icon/order/logo_order_bhc.png';
import cjFoodVips2x from '@/assets/images/icon/order/logo_order_cj_food_vips_2x.png';
import cjFoodVips3x from '@/assets/images/icon/order/logo_order_cj_food_vips_3x.png';
import cjFoodVips from '@/assets/images/icon/order/logo_order_cj_food_vips.png';
import css2x from '@/assets/images/icon/order/logo_order_css_2x.png';
import css3x from '@/assets/images/icon/order/logo_order_css_3x.png';
import css from '@/assets/images/icon/order/logo_order_css.png';
import daegu2x from '@/assets/images/icon/order/logo_order_daegu_2x.png';
import daegu3x from '@/assets/images/icon/order/logo_order_daegu_3x.png';
import daegu from '@/assets/images/icon/order/logo_order_daegu.png';
import daeguro2x from '@/assets/images/icon/order/logo_order_daeguro_2x.png';
import daeguro3x from '@/assets/images/icon/order/logo_order_daeguro_3x.png';
import daeguro from '@/assets/images/icon/order/logo_order_daeguro.png';
import daonfresh2x from '@/assets/images/icon/order/logo_order_daonfresh_2x.png';
import daonfresh3x from '@/assets/images/icon/order/logo_order_daonfresh_3x.png';
import daonfresh from '@/assets/images/icon/order/logo_order_daonfresh.png';
import doyajokbalnfood2x from '@/assets/images/icon/order/logo_order_doyajokbalnfood_2x.png';
import doyajokbalnfood3x from '@/assets/images/icon/order/logo_order_doyajokbalnfood_3x.png';
import doyajokbalnfood from '@/assets/images/icon/order/logo_order_doyajokbalnfood.png';
import dreamnhappy2x from '@/assets/images/icon/order/logo_order_dreamnhappy_2x.png';
import dreamnhappy3x from '@/assets/images/icon/order/logo_order_dreamnhappy_3x.png';
import dreamnhappy from '@/assets/images/icon/order/logo_order_dreamnhappy.png';
import emart242x from '@/assets/images/icon/order/logo_order_emart24_2x.png';
import emart243x from '@/assets/images/icon/order/logo_order_emart24_3x.png';
import emart24 from '@/assets/images/icon/order/logo_order_emart24.png';
import firstkitchen2x from '@/assets/images/icon/order/logo_order_firstkitchen_2x.png';
import firstkitchen3x from '@/assets/images/icon/order/logo_order_firstkitchen_3x.png';
import firstkitchen from '@/assets/images/icon/order/logo_order_firstkitchen.png';
import foodfly2x from '@/assets/images/icon/order/logo_order_foodfly_2x.png';
import foodfly3x from '@/assets/images/icon/order/logo_order_foodfly_3x.png';
import foodfly from '@/assets/images/icon/order/logo_order_foodfly.png';
import foodtech2x from '@/assets/images/icon/order/logo_order_foodtech_2x.png';
import foodtech3x from '@/assets/images/icon/order/logo_order_foodtech_3x.png';
import foodtech from '@/assets/images/icon/order/logo_order_foodtech.png';
import gsLalavla2x from '@/assets/images/icon/order/logo_order_gs_lalavla_2x.png';
import gsLalavla3x from '@/assets/images/icon/order/logo_order_gs_lalavla_3x.png';
import gsLalavla from '@/assets/images/icon/order/logo_order_gs_lalavla.png';
import honeybees2x from '@/assets/images/icon/order/logo_order_honeybees_2x.png';
import honeybees3x from '@/assets/images/icon/order/logo_order_honeybees_3x.png';
import honeybees from '@/assets/images/icon/order/logo_order_honeybees.png';
import hyundaidept2x from '@/assets/images/icon/order/logo_order_hyundaidept_2x.png';
import hyundaidept3x from '@/assets/images/icon/order/logo_order_hyundaidept_3x.png';
import hyundaidept from '@/assets/images/icon/order/logo_order_hyundaidept.png';
import imtsoft2x from '@/assets/images/icon/order/logo_order_imtsoft_2x.png';
import imtsoft3x from '@/assets/images/icon/order/logo_order_imtsoft_3x.png';
import imtsoft from '@/assets/images/icon/order/logo_order_imtsoft.png';
import kakao2x from '@/assets/images/icon/order/logo_order_kakao_2x.png';
import kakao3x from '@/assets/images/icon/order/logo_order_kakao_3x.png';
import kakao from '@/assets/images/icon/order/logo_order_kakao.png';
import kfc from '@/assets/images/icon/order/logo_order_kfc.png';
import kfc2x from '@/assets/images/icon/order/logo_order_kfc@2x.png';
import kfc3x from '@/assets/images/icon/order/logo_order_kfc@3x.png';
import kiosk2x from '@/assets/images/icon/order/logo_order_kiosk_2x.png';
import kiosk3x from '@/assets/images/icon/order/logo_order_kiosk_3x.png';
import kiosk from '@/assets/images/icon/order/logo_order_kiosk.png';
import konai2x from '@/assets/images/icon/order/logo_order_konai_2x.png';
import konai3x from '@/assets/images/icon/order/logo_order_konai_3x.png';
import konai from '@/assets/images/icon/order/logo_order_konai.png';
import krispykreme2x from '@/assets/images/icon/order/logo_order_krispykreme_2x.png';
import krispykreme3x from '@/assets/images/icon/order/logo_order_krispykreme_3x.png';
import krispykreme from '@/assets/images/icon/order/logo_order_krispykreme.png';
import lastorder2x from '@/assets/images/icon/order/logo_order_lastorder_2x.png';
import lastorder3x from '@/assets/images/icon/order/logo_order_lastorder_3x.png';
import lastorder from '@/assets/images/icon/order/logo_order_lastorder.png';
import lotteria2x from '@/assets/images/icon/order/logo_order_lotteria_2x.png';
import lotteria3x from '@/assets/images/icon/order/logo_order_lotteria_3x.png';
import lotteria from '@/assets/images/icon/order/logo_order_lotteria.png';
import meatpeople2x from '@/assets/images/icon/order/logo_order_meatpeople_2x.png';
import meatpeople3x from '@/assets/images/icon/order/logo_order_meatpeople_3x.png';
import meatpeople from '@/assets/images/icon/order/logo_order_meatpeople.png';
import mfgkorea2x from '@/assets/images/icon/order/logo_order_mfgkorea_2x.png';
import mfgkorea3x from '@/assets/images/icon/order/logo_order_mfgkorea_3x.png';
import mfgkorea from '@/assets/images/icon/order/logo_order_mfgkorea.png';
import mybell2x from '@/assets/images/icon/order/logo_order_mybell_2x.png';
import mybell3x from '@/assets/images/icon/order/logo_order_mybell_3x.png';
import mybell from '@/assets/images/icon/order/logo_order_mybell.png';
import myeongsu2x from '@/assets/images/icon/order/logo_order_myeongsu_2x.png';
import myeongsu3x from '@/assets/images/icon/order/logo_order_myeongsu_3x.png';
import myeongsu from '@/assets/images/icon/order/logo_order_myeongsu.png';
import myungsu2x from '@/assets/images/icon/order/logo_order_myungsu_2x.png';
import myungsu3x from '@/assets/images/icon/order/logo_order_myungsu_3x.png';
import myungsu from '@/assets/images/icon/order/logo_order_myungsu.png';
import naver2x from '@/assets/images/icon/order/logo_order_naver_2x.png';
import naver3x from '@/assets/images/icon/order/logo_order_naver_3x.png';
import naver from '@/assets/images/icon/order/logo_order_naver.png';
import nene2x from '@/assets/images/icon/order/logo_order_nene_2x.png';
import nene3x from '@/assets/images/icon/order/logo_order_nene_3x.png';
import nene from '@/assets/images/icon/order/logo_order_nene.png';
import nhnpayco2x from '@/assets/images/icon/order/logo_order_nhnpayco_2x.png';
import nhnpayco3x from '@/assets/images/icon/order/logo_order_nhnpayco_3x.png';
import nhnpayco from '@/assets/images/icon/order/logo_order_nhnpayco.png';
import nowbusking2x from '@/assets/images/icon/order/logo_order_nowbusking_2x.png';
import nowbusking3x from '@/assets/images/icon/order/logo_order_nowbusking_3x.png';
import nowbusking from '@/assets/images/icon/order/logo_order_nowbusking.png';
import nowpick2x from '@/assets/images/icon/order/logo_order_nowpick_2x.png';
import nowpick3x from '@/assets/images/icon/order/logo_order_nowpick_3x.png';
import nowpick from '@/assets/images/icon/order/logo_order_nowpick.png';
import okpos2x from '@/assets/images/icon/order/logo_order_okpos_2x.png';
import okpos3x from '@/assets/images/icon/order/logo_order_okpos_3x.png';
import okpos from '@/assets/images/icon/order/logo_order_okpos.png';
import oliveyoung2x from '@/assets/images/icon/order/logo_order_oliveyoung_2x.png';
import oliveyoung3x from '@/assets/images/icon/order/logo_order_oliveyoung_3x.png';
import oliveyoung from '@/assets/images/icon/order/logo_order_oliveyoung.png';
import payco2x from '@/assets/images/icon/order/logo_order_payco_2x.png';
import payco3x from '@/assets/images/icon/order/logo_order_payco_3x.png';
import payco from '@/assets/images/icon/order/logo_order_payco.png';
import pos2x from '@/assets/images/icon/order/logo_order_pos_2x.png';
import pos3x from '@/assets/images/icon/order/logo_order_pos_3x.png';
import pos from '@/assets/images/icon/order/logo_order_pos.png';
import posbank2x from '@/assets/images/icon/order/logo_order_posbank_2x.png';
import posbank3x from '@/assets/images/icon/order/logo_order_posbank_3x.png';
import posbank from '@/assets/images/icon/order/logo_order_posbank.png';
import posfeed2x from '@/assets/images/icon/order/logo_order_posfeed_2x.png';
import posfeed3x from '@/assets/images/icon/order/logo_order_posfeed_3x.png';
import posfeed from '@/assets/images/icon/order/logo_order_posfeed.png';
import self2x from '@/assets/images/icon/order/logo_order_self_2x.png';
import self3x from '@/assets/images/icon/order/logo_order_self_3x.png';
import self from '@/assets/images/icon/order/logo_order_self.png';
import sfNobrandburger2x from '@/assets/images/icon/order/logo_order_sf_nobrandburger_2x.png';
import sfNobrandburger3x from '@/assets/images/icon/order/logo_order_sf_nobrandburger_3x.png';
import sfNobrandburger from '@/assets/images/icon/order/logo_order_sf_nobrandburger.png';
import sfNobrandpizza2x from '@/assets/images/icon/order/logo_order_sf_nobrandpizza_2x.png';
import sfNobrandpizza3x from '@/assets/images/icon/order/logo_order_sf_nobrandpizza_3x.png';
import sfNobrandpizza from '@/assets/images/icon/order/logo_order_sf_nobrandpizza.png';
import shuttle2x from '@/assets/images/icon/order/logo_order_shuttle_2x.png';
import shuttle3x from '@/assets/images/icon/order/logo_order_shuttle_3x.png';
import shuttle from '@/assets/images/icon/order/logo_order_shuttle.png';
import somunnanshop2x from '@/assets/images/icon/order/logo_order_somunnanshop_2x.png';
import somunnanshop3x from '@/assets/images/icon/order/logo_order_somunnanshop_3x.png';
import somunnanshop from '@/assets/images/icon/order/logo_order_somunnanshop.png';
import spBrBaskinrobbins2x from '@/assets/images/icon/order/logo_order_sp_br_baskinrobbins_2x.png';
import spBrBaskinrobbins3x from '@/assets/images/icon/order/logo_order_sp_br_baskinrobbins_3x.png';
import spBrBaskinrobbins from '@/assets/images/icon/order/logo_order_sp_br_baskinrobbins.png';
import spc2x from '@/assets/images/icon/order/logo_order_spc_2x.png';
import spc3x from '@/assets/images/icon/order/logo_order_spc_3x.png';
import spc from '@/assets/images/icon/order/logo_order_spc.png';
import spiderinc2X from '@/assets/images/icon/order/logo_order_spiderinc_2X.png';
import spiderinc3X from '@/assets/images/icon/order/logo_order_spiderinc_3X.png';
import spiderinc from '@/assets/images/icon/order/logo_order_spiderinc.png';
import starbucks2x from '@/assets/images/icon/order/logo_order_starbucks_2x.png';
import starbucks3x from '@/assets/images/icon/order/logo_order_starbucks_3x.png';
import starbucks from '@/assets/images/icon/order/logo_order_starbucks.png';
import tengo2x from '@/assets/images/icon/order/logo_order_tengo_2x.png';
import tengo3x from '@/assets/images/icon/order/logo_order_tengo_3x.png';
import tengo from '@/assets/images/icon/order/logo_order_tengo.png';
import tgif2x from '@/assets/images/icon/order/logo_order_tgif_2x.png';
import tgif3x from '@/assets/images/icon/order/logo_order_tgif_3x.png';
import tgif from '@/assets/images/icon/order/logo_order_tgif.png';
import tonymoly2x from '@/assets/images/icon/order/logo_order_tonymoly_2x.png';
import tonymoly3x from '@/assets/images/icon/order/logo_order_tonymoly_3x.png';
import tonymoly from '@/assets/images/icon/order/logo_order_tonymoly.png';
import twosomeplace2x from '@/assets/images/icon/order/logo_order_twosomeplace_2x.png';
import twosomeplace3x from '@/assets/images/icon/order/logo_order_twosomeplace_3x.png';
import twosomeplace from '@/assets/images/icon/order/logo_order_twosomeplace.png';
import ulsanpay2x from '@/assets/images/icon/order/logo_order_ulsanpay_2x.png';
import ulsanpay3x from '@/assets/images/icon/order/logo_order_ulsanpay_3x.png';
import ulsanpay from '@/assets/images/icon/order/logo_order_ulsanpay.png';
import unionsoft2x from '@/assets/images/icon/order/logo_order_unionsoft_2x.png';
import unionsoft3x from '@/assets/images/icon/order/logo_order_unionsoft_3x.png';
import unionsoft from '@/assets/images/icon/order/logo_order_unionsoft.png';
import unknown2x from '@/assets/images/icon/order/logo_order_unknown_2x.png';
import unknown3x from '@/assets/images/icon/order/logo_order_unknown_3x.png';
import unknown from '@/assets/images/icon/order/logo_order_unknown.png';
import wemakepriceo2x from '@/assets/images/icon/order/logo_order_wemakepriceo_2x.png';
import wemakepriceo3x from '@/assets/images/icon/order/logo_order_wemakepriceo_3x.png';
import wemakepriceo from '@/assets/images/icon/order/logo_order_wemakepriceo.png';
import wmpo2x from '@/assets/images/icon/order/logo_order_wmpo_2x.png';
import wmpo3x from '@/assets/images/icon/order/logo_order_wmpo_3x.png';
import wmpo from '@/assets/images/icon/order/logo_order_wmpo.png';
import yogiyo2x from '@/assets/images/icon/order/logo_order_yogiyo_2x.png';
import yogiyo3x from '@/assets/images/icon/order/logo_order_yogiyo_3x.png';
import yogiyoDelivery2x from '@/assets/images/icon/order/logo_order_yogiyo_delivery_2x.png';
import yogiyoDelivery3x from '@/assets/images/icon/order/logo_order_yogiyo_delivery_3x.png';
import yogiyoDelivery from '@/assets/images/icon/order/logo_order_yogiyo_delivery.png';
import yogiyo from '@/assets/images/icon/order/logo_order_yogiyo.png';

export default defineComponent({
  name: 'OrderAgencyIcon',
  props: {
    orderAgencyId: {
      type: String,
      default: 'unknown',
    },
  },
  setup(props) {
    const defaultIconSet = [unknown, unknown2x, unknown3x];
    const iconSets = {
      '13mile': [_13mile, _13mile2x, _13mile3x],
      admin: [admin, admin2x, admin3x],
      ainopos: [ainopos, ainopos2x, ainopos3x],
      amore_aritaum: [amoreAritaum, amoreAritaum2x, amoreAritaum3x],
      angelinus: [angelinus, angelinus2x, angelinus3x],
      angelsoft: [angelsoft, angelsoft2x, angelsoft3x],
      baechelin: [baechelin, baechelin2x, baechelin3x],
      baegofa: [baegofa, baegofa2x, baegofa3x],
      baemin: [baemin, baemin2x, baemin3x],
      baemin_delivery: [baeminDelivery, baeminDelivery2x, baeminDelivery3x],
      barogo_hq: [barogoHq, barogoHq2x, barogoHq3x],
      barogo_hub: [barogoHub, barogoHub2x, barogoHub3x],
      barogo_store: [barogoStore, barogoStore2x, barogoStore3x],
      beyondpos: [beyondpos, beyondpos2x, beyondpos3x],
      bgfretail: [bgfretail, bgfretail2x, bgfretail3x],
      bhc: [bhc, bhc2x, bhc3x],
      cj_food_vips: [cjFoodVips, cjFoodVips2x, cjFoodVips3x],
      css: [css, css2x, css3x],
      daegu: [daegu, daegu2x, daegu3x],
      daeguro: [daeguro, daeguro2x, daeguro3x],
      daonfresh: [daonfresh, daonfresh2x, daonfresh3x],
      doyajokbalnfood: [doyajokbalnfood, doyajokbalnfood2x, doyajokbalnfood3x],
      dreamnhappy: [dreamnhappy, dreamnhappy2x, dreamnhappy3x],
      emart24: [emart24, emart242x, emart243x],
      firstkitchen: [firstkitchen, firstkitchen2x, firstkitchen3x],
      foodfly: [foodfly, foodfly2x, foodfly3x],
      foodtech: [foodtech, foodtech2x, foodtech3x],
      gs_lalavla: [gsLalavla, gsLalavla2x, gsLalavla3x],
      honeybees: [honeybees, honeybees2x, honeybees3x],
      hyundaidept: [hyundaidept, hyundaidept2x, hyundaidept3x],
      imtsoft: [imtsoft, imtsoft2x, imtsoft3x],
      kakao: [kakao, kakao2x, kakao3x],
      kfc: [kfc, kfc2x, kfc3x],
      kiosk: [kiosk, kiosk2x, kiosk3x],
      konai: [konai, konai2x, konai3x],
      krispykreme: [krispykreme, krispykreme2x, krispykreme3x],
      lastorder: [lastorder, lastorder2x, lastorder3x],
      lotteria: [lotteria, lotteria2x, lotteria3x],
      meatpeople: [meatpeople, meatpeople2x, meatpeople3x],
      mfgkorea: [mfgkorea, mfgkorea2x, mfgkorea3x],
      mybell: [mybell, mybell2x, mybell3x],
      myeongsu: [myeongsu, myeongsu2x, myeongsu3x],
      myungsu: [myungsu, myungsu2x, myungsu3x],
      naver: [naver, naver2x, naver3x],
      nene: [nene, nene2x, nene3x],
      nhnpayco: [nhnpayco, nhnpayco2x, nhnpayco3x],
      nowbusking: [nowbusking, nowbusking2x, nowbusking3x],
      nowpick: [nowpick, nowpick2x, nowpick3x],
      okpos: [okpos, okpos2x, okpos3x],
      oliveyoung: [oliveyoung, oliveyoung2x, oliveyoung3x],
      payco: [payco, payco2x, payco3x],
      pos: [pos, pos2x, pos3x],
      posbank: [posbank, posbank2x, posbank3x],
      posfeed: [posfeed, posfeed2x, posfeed3x],
      self: [self, self2x, self3x],
      sf_nobrandburger: [sfNobrandburger, sfNobrandburger2x, sfNobrandburger3x],
      sf_nobrandpizza: [sfNobrandpizza, sfNobrandpizza2x, sfNobrandpizza3x],
      shuttle: [shuttle, shuttle2x, shuttle3x],
      somunnanshop: [somunnanshop, somunnanshop2x, somunnanshop3x],
      sp_br_baskinrobbins: [spBrBaskinrobbins, spBrBaskinrobbins2x, spBrBaskinrobbins3x],
      spc: [spc, spc2x, spc3x],
      spiderinc: [spiderinc, spiderinc2X, spiderinc3X],
      starbucks: [starbucks, starbucks2x, starbucks3x],
      tengo: [tengo, tengo2x, tengo3x],
      tgif: [tgif, tgif2x, tgif3x],
      tonymoly: [tonymoly, tonymoly2x, tonymoly3x],
      twosomeplace: [twosomeplace, twosomeplace2x, twosomeplace3x],
      ulsanpay: [ulsanpay, ulsanpay2x, ulsanpay3x],
      unionsoft: [unionsoft, unionsoft2x, unionsoft3x],
      wemakepriceo: [wemakepriceo, wemakepriceo2x, wemakepriceo3x],
      wmpo: [wmpo, wmpo2x, wmpo3x],
      yogiyo: [yogiyo, yogiyo2x, yogiyo3x],
      yogiyo_delivery: [yogiyoDelivery, yogiyoDelivery2x, yogiyoDelivery3x],
    };

    return {
      iconSet: computed(() => iconSets[props.orderAgencyId] || defaultIconSet),
    };
  },
});
</script>

<style lang="scss" scoped>
img {
  vertical-align: middle;
  width: 1.6rem;
  height: 1.6rem;
}
</style>
