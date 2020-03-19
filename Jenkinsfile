def functionalTestUrl = null

void setBuildStatus(String message, String state, String context) {
  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/paladinarcher/vetsez-ds-demo1-coding-challenge-app"],
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: context],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

pipeline {
    agent {
        node {
            label 'ruby'
        }
    }
    parameters {
        string(name: 'releaseVersion', defaultValue: '', description: 'Provide the release version (leave blank for no release):')
        string(name: 'developmentVersion', defaultValue: '', description: 'Provide the next development version (leave blank for no release):')
    }
    environment {
        DATABASE_USER = 'dsbpa'
        DATABASE_PASSWORD = 'dsbpa'
        DATABASE_SCHEMA = 'ci'
    }
    stages {
        stage('Create Release') {
            when {
                expression {
                    return params.releaseVersion != ''
                }
            }
            steps {
                //Set release version
                sh "mvn org.codehaus.mojo:versions-maven-plugin:2.5:set -DnewVersion=${params.releaseVersion} -DgenerateBackupPoms=false -DprocessAllModules=true"

                //Update SNAPSHOT dependencies to their release versions if available
                sh "mvn org.codehaus.mojo:versions-maven-plugin:2.5::use-releases -DprocessParent=true"

                //Check for any snapshot versions remaining
                sh "mvn compile validate"

                //Commit changes locally
                sh "git commit -a -m \"Releasing version ${params.releaseVersion}\""

                //Tag release
                sh "git tag -a ${params.releaseVersion} -m \"Release version ${params.releaseVersion}\""

                //Set the next dev version
                sh "mvn org.codehaus.mojo:versions-maven-plugin:2.5::set -DnewVersion=${params.developmentVersion}  -DgenerateBackupPoms=false -DprocessAllModules=true"
                //Commit changes locally
                sh "git commit -a -m \"Preparing POMs for next development version ${params.developmentVersion}\""

                script {
                    def url = sh(returnStdout: true, script: 'git config remote.origin.url').trim()
                    def repo = url.substring(url.indexOf('://')+3)
                    withCredentials([usernamePassword(credentialsId: 'github', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        //Push the branch to the remote
                        sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@${repo} HEAD:${env.BRANCH_NAME}"
                        //Push the tag to the remote
                        sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@${repo} --tags"
                    }
                }

                //Checkout the tag
                sh "git checkout tags/${params.releaseVersion}"
            }

            post {
              success {
                setBuildStatus("Create Release.", "SUCCESS", "ci/jenkins/createRelease")
              }
              failure {
                setBuildStatus("Create Release.", "FAILURE", "ci/jenkins/createRelease")
              }
            }
        }
        stage('Building Application') {
            steps {
                sh "mvn clean install"
                stash name: 'mavenOutput', includes: '**/target/*'
            }
            // post {
            //     always {
            //         junit '**/target/surefire-reports/*.xml'
            //     }
            // }

            post {
              success {
                setBuildStatus("Building Application.", "SUCCESS", "ci/jenkins/buildingApplication")
              }
              failure {
                setBuildStatus("Building Application.", "FAILURE", "ci/jenkins/buildingApplication")
              }
            }
        }
        stage('Source Code Analysis') {
            steps {
                //withSonarQubeEnv('SonarQube on K8S') {
                  //sh 'ls -lah . && git status && pwd'
                  //sh 'mvn sonar:sonar'
                  //sh 'mvn org.sonarsource.scanner.maven:sonar-maven-plugin:3.6.0.1398:sonar'
                //}
                //timeout(time: 10, unit: 'MINUTES') {
                  //waitForQualityGate abortPipeline: false
                //}
                echo "Removing SonarQube due to instability, we'll add something back in when we figure it all out."
            }
            post {
              success {
                setBuildStatus("Source Code Analysis.", "SUCCESS", "ci/jenkins/sourceCodeAnalysis")
              }
              failure {
                setBuildStatus("Source Code Analysis.", "FAILURE", "ci/jenkins/sourceCodeAnalysis")
              }
            }
        }
        stage("Build Containers") {
            parallel {
                stage("Database Migration Container") {
                    agent {
                        node {
                            label 'docker'
                        }
                    }
                    steps {
                        script {
                            if (params.releaseVersion != '') {
                                //Checkout the tag
                                def url = sh(returnStdout: true, script: 'git config remote.origin.url').trim()
                                def repo = url.substring(url.indexOf('://')+3)
                                withCredentials([usernamePassword(credentialsId: 'github', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                                    sh "git fetch https://${GIT_USERNAME}:${GIT_PASSWORD}@${repo} +refs/tags/${params.releaseVersion}:refs/tags/${params.releaseVersion}"
                                    sh "git checkout tags/${params.releaseVersion}"
                                }
                            }
                            def DOCKER_REGISTRY_URI = env.DOCKER_REGISTRY_URL
                            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker-registry',
                              usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                              sh 'docker login --password=${PASSWORD} --username=${USERNAME} ${DOCKER_REGISTRY_URI}'
                            //}
                            //docker.withRegistry(env.DOCKER_REGISTRY_URL, "docker-registry") { //env.DOCKER_REGISTRY_URL
                                dbImage = docker.build("paladinarcher/coding-challenge-db-init", "-f Dockerfile.db-init .")
                                dbImage.push("${env.BRANCH_NAME}-${env.GIT_COMMIT}")
                                if (params.releaseVersion != '') {
                                    dbImage.push(params.releaseVersion)
                                }
                            }
                        }
                    }
                    post {
                      success {
                        setBuildStatus("Database Migration Container.", "SUCCESS", "ci/jenkins/databaseMigrationContainer")
                      }
                      failure {
                        setBuildStatus("Database Migration Container.", "FAILURE", "ci/jenkins/databaseMigrationContainer")
                      }
                    }
                }
                stage("Application Container") {
                    agent {
                        node {
                            label 'docker'
                        }
                    }
                    steps {
                        unstash 'mavenOutput'
                        script {
                            def DOCKER_REGISTRY_URI = env.DOCKER_REGISTRY_URL
                            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker-registry',
                              usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                              sh 'docker login --password=${PASSWORD} --username=${USERNAME} ${DOCKER_REGISTRY_URI}'
                            //docker.withRegistry(env.DOCKER_REGISTRY_URL, "docker-registry") { //env.DOCKER_REGISTRY_URL
                                image = docker.build("paladinarcher/coding-challenge-app")
                                image.push("${env.BRANCH_NAME}-${env.GIT_COMMIT}")
                                if (params.releaseVersion != '') {
                                    image.push(params.releaseVersion)
                                }
                            }
                        }
                    }
                    post {
                      success {
                        setBuildStatus("Application Container.", "SUCCESS", "ci/jenkins/applicationContainer")
                      }
                      failure {
                        setBuildStatus("Application Container.", "FAILURE", "ci/jenkins/applicationContainer")
                      }
                    }
                }
            }
        }
        stage("Testing") {
            parallel {
                stage("Functional") {
                    stages {
                        stage('Deploy Functional Test Environment') {
                            agent {
                                node {
                                    label 'helm'
                                }
                            }
                            steps {
                                script {
                                    def releaseName = "ft-${env.BRANCH_NAME.toLowerCase()}"
                                    //Download the Chart
                                    sh "git clone \"https://github.com/paladinarcher/vetsez-ds-demo1-coding-challenge-devops.git\" helmChart"

                                    //Deploy the Chart
                                    sh "helm install ${releaseName} --set \"image.tag=${env.BRANCH_NAME}-${env.GIT_COMMIT}\" --set \"initImage.tag=${env.BRANCH_NAME}-${env.GIT_COMMIT}\" --set \"image.pullPolicy=Always\" --set \"initImage.pullPolicy=Always\" --set \"postgresql.persistence.enabled=false\" --namespace demo helmChart/k8s/coding-challenge-app"

                                    //Find the Service Port
                                    def count = 0
                                    functionalTestUrl = "http://"
                                    while (functionalTestUrl=="http://" && count < 300) {
                                      functionalTestUrl = sh(returnStdout: true, script: "kubectl get --namespace demo services -l app.kubernetes.io/instance=${releaseName} -o jsonpath=\"http://{.items[0].metadata.name}.development.svc.cluster.local:{.items[0].spec.ports[0].port}\"")
                                      if(functionalTestUrl=="http://") { sleep 5 }
                                      count+=10
                                    }
                                    echo "Service is available at ${functionalTestUrl}"
                                }
                            }
                            post {
                              success {
                                setBuildStatus("Deploy Functional Test Environment.", "SUCCESS", "ci/jenkins/deployFunctionalTestEnvironment")
                              }
                              failure {
                                setBuildStatus("Deploy Functional Test Environment.", "FAILURE", "ci/jenkins/deployFunctionalTestEnvironment")
                              }
                                //Clean up our helm checkout
                                always {
                                    sh 'rm -rf helmChart'
                                }
                            }
                        }
                        stage('Functional Test Execution') {
                            agent {
                                node {
                                    label 'selenium'
                                }
                            }
                            steps {
                                script {
                                    try {
                                        dir('test/selenium') {
                                            sh "echo \"Working Directory is \$(pwd)\""
                                            sh 'yarn install'
                                            sh "mkdir -p reports"
                                            sh "export PATH=\$PATH:/usr/bin:\$(pwd)/node_modules/.bin:\$(pwd)/node_modules/chromedriver/lib/chromedriver; selenium-side-runner --base-url ${functionalTestUrl} --server http://localhost:4444/wd/hub --output-directory=reports --output-format=junit -c \"browserName=chrome\" coding-challenge-app.side"
                                        }
                                    } catch (err) {
                                        if (env.BRANCH_NAME != 'master') {
                                            currentBuild.result = 'UNSTABLE'
                                        } else {
                                            throw err
                                        }
                                    }
                                }
                            }
                            post {
                              success {
                                setBuildStatus("Functional Test Execution.", "SUCCESS", "ci/jenkins/functionalTestExecution")
                              }
                              failure {
                                setBuildStatus("Functional Test Execution.", "FAILURE", "ci/jenkins/functionalTestExecution")
                              }
                                always {
                                    junit '**/test/selenium/reports/*.xml'
                                }
                            }
                        }
                    }
                    post {
                        always {
                            script {
                                node('helm') {
                                    sh ("helm delete ft-${env.BRANCH_NAME.toLowerCase()} --namespace demo")
                                }
                            }
                        }
                    }
                }

                stage("Performance Testing") {
                    steps {
                        echo "TDB..."
                    }
                    post {
                      success {
                        setBuildStatus("Performance Testing.", "SUCCESS", "ci/jenkins/performanceTesting")
                      }
                      failure {
                        setBuildStatus("Performance Testing.", "FAILURE", "ci/jenkins/performanceTesting")
                      }
                    }
                }
            }
        }

        stage("Review Instance Deployment") {
            when {
                changeRequest()
            }
            agent {
                node {
                    label 'helm'
                }
            }
            steps {
                script {
                    def releaseName = "${env.BRANCH_NAME.toLowerCase()}"
                    //Download the Chart
                    sh "git clone \"https://github.com/paladinarcher/vetsez-ds-demo1-coding-challenge-devops.git\" helmChart"

                    //Deploy the Chart
                    sh "helm upgrade --tiller-namespace flux --install ${releaseName}  --set \"image.tag=${env.BRANCH_NAME}-${env.GIT_COMMIT}\" --set \"initImage.tag=${env.BRANCH_NAME}-${env.GIT_COMMIT}\" --set \"image.pullPolicy=Always\" --set \"initImage.pullPolicy=Always\" --set \"postgresql.persistence.enabled=false\" --namespace demo helmChart/k8s/coding-challenge-app"
                    
                    //Wait a few seconds for the external IP to be allocated
                    def count = 0
                    def previewUrl = "http://"
                    while (previewUrl=="http://" && count < 300) {
                      previewUrl = sh(returnStdout: true, script: "kubectl get --namespace development services -l app.kubernetes.io/instance=${releaseName} -o jsonpath=\"http://{.items[0].status.loadBalancer.ingress[0].hostname}\"")
                      if(previewUrl=="http://") { sleep 5 }
                      count+=10
                    }

                    if(previewUrl=="http://") {
                      error("Failed to get a preview URL in ${count} seconds...")
                    }
                    //Print out the preview instance URL
                    echo "Preview instance is available at ${previewUrl}/dsbpa"

                    //Add the Preview URL to the PR
                    pullRequest.createStatus(
                        status: 'success',
                        context: 'continuous-integration/jenkins/pr-merge/preview',
                        description: 'Preview Instance',
                        targetUrl: "${previewUrl}/dsbpa"
                    )
                }
            }
            post {
              success {
                setBuildStatus("Review Instance Deployment.", "SUCCESS", "ci/jenkins/reviewInstanceDeployment")
              }
              failure {
                setBuildStatus("Review Instance Deployment.", "FAILURE", "ci/jenkins/reviewInstanceDeployment")
              }
                //Clean up our helm checkout
                always {
                    sh 'rm -rf helmChart'
                }
            }
        }
        
        
        stage("Promote to Development") {
            when {
                not {
                    changeRequest()
                }
            }
            agent {
                node {
                    label 'docker'
                }
            }
            steps {
                script {
                    def DOCKER_REGISTRY_URI = env.DOCKER_REGISTRY_URL
                        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker-registry',
                          usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                          sh 'docker login --password=${PASSWORD} --username=${USERNAME} ${DOCKER_REGISTRY_URI}'
                    //docker.withRegistry(env.DOCKER_REGISTRY_URL, "docker-registry") { //env.DOCKER_REGISTRY_URL
                        image = docker.image("paladinarcher/coding-challenge-app:${env.BRANCH_NAME}-${env.GIT_COMMIT}")
                        image.pull()
                        image.push("development-${env.GIT_COMMIT}")
                        image.push("latest")
                        initImage = docker.image("paladinarcher/coding-challenge-db-init:${env.BRANCH_NAME}-${env.GIT_COMMIT}")
                        initImage.pull()
                        initImage.push("development-${env.GIT_COMMIT}")
                        initImage.push("latest")
                    }
                }
            }
            post {
              success {
                setBuildStatus("Promote to Development.", "SUCCESS", "ci/jenkins/promoteToDevelopment")
              }
              failure {
                setBuildStatus("Promote to Development.", "FAILURE", "ci/jenkins/promoteToDevelopment")
              }
            }
        }
    }
}