#!groovy

import groovy.json.JsonOutput
import java.util.Optional
import java.text.SimpleDateFormat
import hudson.model.*
import jenkins.model.*
import hudson.model.Fingerprint.RangeSet

node('agent-gorela') {
// node {
    def allocatorApp
    def interlockerApp
    def presenterApp
    def adminApp
    def adminClientApp
    def clientLoggerApp
    def reDocOrderAgencyApp
    def reDocDeliveryAgencyApp
    def nodeEnv = "production"
    def scmVars
    def currentBranch
    def dockerTag
    def gitAuthour = "gorela"
    def gitLastCommitMessage = "init"
    def namespace = "gorela"
    def kibanaurl = "https://staging-kibana.gorelas.com/goto/7b48edc6002cb9e3ecdb7eb4ab1e9dca"
    // String[] buildAllServerList = ["store-web-client"]
    String[] buildTargetServerList = ["store-web-client"]

    try {
        scmVars = checkout scm

        // git tag 동기화: git tag 는 git pull 로 remote 에서 제거된 tag 가 제거 되지 않음. tag 는 jenkins 에서 알아서 fetch 함
        sh(script: "git checkout ${scmVars.GIT_BRANCH}")
        // sh(returnStdout: true, script: "git tag -l | xargs git tag -d") // 마스터 브랜치에서 태그 정보를 가져 오지 못함

        println "current build number => " + env.BUILD_NUMBER

        currentBranch = "${scmVars.GIT_BRANCH}"
        println "currentBranch == ${currentBranch}"

        // [skip ci] commit message 에 포함 되면 build skip
        def isCommitMessageMatchBuildSkip = sh (returnStdout: true, returnStatus: true, script: "git log -1 --pretty=%B | grep '\\[skip build\\]'")
        if (isCommitMessageMatchBuildSkip == 0) {
            println "commit message match [skip build] => " + isCommitMessageMatchBuildSkip
            // deleteCurrentBuild()
            return
        }

        // feature branch 인 경우, [let it build] 또는 [let it build for qc] commit message 에 포함 안되면 build skip
        def isCommitMessageMatchLetItBuild = sh(returnStdout: true, returnStatus: true, script: "git log -1 --pretty=%B | grep '\\[let it build\\]'")
        def isCommitMessageMatchLetItBuildForQc = sh(returnStdout: true, returnStatus: true, script: "git log -1 --pretty=%B | grep '\\[let it build for qc\\]'")
        def isCommitMessageMatchLetItBuildForStaging = sh(returnStdout: true, returnStatus: true, script: "git log -1 --pretty=%B | grep '\\[let it build for staging\\]'")
        if (currentBranch.startsWith("origin/feature") || currentBranch.startsWith("feature/")) {
            if (isCommitMessageMatchLetItBuild == 1 && isCommitMessageMatchLetItBuildForQc == 1 && isCommitMessageMatchLetItBuildForStaging == 1) {
                println "commit message not math [let it build] or [let it build for qc] or [let it build for staging] => ${isCommitMessageMatchLetItBuild} / ${isCommitMessageMatchLetItBuildForQc} / ${isCommitMessageMatchLetItBuildForStaging}"
                // deleteCurrentBuild()
                return
            }
        }

        stage('Set Variable') {
            def commit = sh(returnStdout: true, script: 'git rev-parse HEAD')
            gitAuthour = sh(returnStdout: true, script: "git --no-pager show -s --format='%an' ${commit}").trim()
            gitLastCommitMessage = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()

            def packageVersion = sh(returnStdout: true, script:"grep 'version' ./package.json | head -1 | cut -d '\"' -f4 | tr -d '\\n\'")
            println "packageVersion = ${packageVersion}"

            // production, staging, develop 환경 별 분기
            if (currentBranch == "origin/master" || currentBranch == "master") {
                dockerTag = packageVersion
                println "master dockerTag = ${dockerTag}"

            } else if (currentBranch.startsWith("origin/release") || currentBranch.startsWith("release/") || isCommitMessageMatchLetItBuildForStaging == 0) {
                gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(6)
                dockerTag = "release-${gitCommit}"
                nodeEnv = "staging"
                namespace = "gorela-staging"
                println "release dockerTag = ${dockerTag}"
            } else if (currentBranch.startsWith("origin/hotfix") || currentBranch.startsWith("hotfix/")) {
                gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(6)
                dockerTag = "hotfix-${gitCommit}"
                nodeEnv = "staging"
                namespace = "gorela-staging"
                println "hotfix dockerTag = ${dockerTag}"
            } else if (currentBranch == "origin/develop" || currentBranch == "develop") {
                gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(6)
                dockerTag = "develop-${gitCommit}"
                nodeEnv = "development"
                namespace = "gorela-dev"
                kibanaurl = "https://staging-kibana.gorelas.com/goto/f29b76e2fe3e4ad16aaffa2c0325ec01"
                println "develop dockerTag = ${dockerTag}"
            } else {
                gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(6)
                dockerTag = "other-branch-${gitCommit}"
                nodeEnv = "development"
                namespace = "gorela-dev"
                println "other-branch dockerTag = ${dockerTag}"

                if (isCommitMessageMatchLetItBuildForQc == 0) {
                    namespace = "gorela-qc"
                    nodeEnv = "qc"
                }

                return
            }
        }

        stage('Build start send to slack') {
            notifySlack("", [
                [
                    title: "[${env.JOB_NAME}] [${nodeEnv}] ${currentBranch} by ${gitAuthour} BUILD START!",
                    title_link: "${env.BUILD_URL}",
                    color: "#3498DB",
                    author_name: "${gitAuthour}",
                    fields: [
                        [
                            title: "Branch",
                            value: "${currentBranch}",
                            short: false
                        ],
                        [
                            title: "Last Commit message",
                            value: "${gitLastCommitMessage}",
                            short: false
                        ]
                    ],
                    footer: "${env.JOB_NAME} - ${nodeEnv}",
                    ts: System.currentTimeMillis() / 1000
                ]
            ])
        }

        stage('Build Push') {
            for (int i = 0; i < buildTargetServerList.size(); i++) {
                def targetSvr = buildTargetServerList[i]
                stage("${targetSvr}") {

                    buildApp = docker.build("gorela/${targetSvr}:${dockerTag}", "--network host --build-arg NODE_ENV=${nodeEnv} .")

                    docker.withRegistry("https://653983231979.dkr.ecr.ap-northeast-2.amazonaws.com", "ecr:ap-northeast-2:jenkins") {
                        buildApp.push()
                    }
                }
            }
        }

        stage('Build success send to slack') {
            def deployCliList = []

            for (int i = 0; i < buildTargetServerList.size(); i++) {
                def targetSvr = buildTargetServerList[i]
                deployCliList.add([
                    title: "deploy to k8s for ${targetSvr}",
                    value: "```kubectl --record --namespace=${namespace} set image deployment/${targetSvr} ${targetSvr}=653983231979.dkr.ecr.ap-northeast-2.amazonaws.com/gorela/${targetSvr}:${dockerTag}```",
                    short: false
                ])
            }

            def notiFields = [
                [
                    title: 'Branch',
                    value: "${currentBranch}",
                    short: true
                ],
                [
                    title: 'Target Server',
                    value: "${buildTargetServerList}",
                    short: true
                ],
                [
                    title: 'Last Commit message',
                    value: "${gitLastCommitMessage}",
                    short: false
                ]
            ]

            if (!deployCliList.isEmpty()) {
                notiFields.add(deployCliList)
            }

            notiFields.add([
                [
                    title: 'check log from k8s pod',
                    value: "kubectl --namespace ${namespace} logs -f {pod name}",
                    short: false
                ],
                [
                    title: 'check log from kibana',
                    value: "${kibanaurl}",
                    short: false
                ]
            ])

            notifySlack("", [
                [
                    title: "[${env.JOB_NAME}] [${nodeEnv}] ${currentBranch} by ${gitAuthour} BUILD SUCCESS!",
                    title_link: "${env.BUILD_URL}",
                    color: "#1E8449",
                    author_name: "${gitAuthour}",
                    fields: notiFields.flatten(),
                    footer: "${env.JOB_NAME} - ${nodeEnv}",
                    ts: System.currentTimeMillis() / 1000
                ]
            ])
        }

    } catch (e) {
        notifySlack("", [
            [
                title: "[${env.JOB_NAME}] [${nodeEnv}] ${currentBranch} by ${gitAuthour} BUILD FAIL!",
                title_link: "${env.BUILD_URL}",
                color: "#CB4335",
                author_name: "${gitAuthour}",
                fields: [
                    [
                        title: "Branch",
                        value: "${currentBranch}",
                        short: false
                    ],
                    [
                        title: "Last Commit message",
                        value: "${gitLastCommitMessage}",
                        short: false
                    ]
                ],
                footer: "${env.JOB_NAME} - ${nodeEnv}",
                ts: System.currentTimeMillis() / 1000
            ]
        ])
        throw e
    }
}

def notifySlack(text, attachments) {
    def slackURL = 'https://hooks.slack.com/services/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' // gorela_ci_cd
    def jenkinsIcon = 'https://avatars.slack-edge.com/2019-05-08/628787263668_7a9ee5e84462be745c7a_48.jpg'

    def payload = JsonOutput.toJson([text: text,
        channel: 'gorela_ci_cd',
        // channel: 'shared_alert_channel',
        username: "Jenkins",
        icon_url: jenkinsIcon,
        attachments: attachments
    ])

    sh "curl -X POST --data-urlencode \'payload=${payload}\' ${slackURL}"
}

def deleteCurrentBuild() {
    def job = jenkins.model.Jenkins.instance.getItem("gorela")
    def buildRange = RangeSet.fromString(env.BUILD_NUMBER.toString(), true);
    job.getBuilds(buildRange).each { it.delete() }
}
