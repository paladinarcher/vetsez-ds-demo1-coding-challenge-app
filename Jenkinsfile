def functionalTestUrl = null

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
        }
        stage('Source Code Analysis') {
            steps {
                echo "TDB..."
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
                            docker.withRegistry(env.DOCKER_REGISTRY_URL, "docker-registry") {
                                dbImage = docker.build("meetveracity/coding-challenge-db-init", "-f Dockerfile.db-init .")
                                dbImage.push("${env.BRANCH_NAME}")
                                if (params.releaseVersion != '') {
                                    dbImage.push(params.releaseVersion)
                                }
                            }
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
                            docker.withRegistry(env.DOCKER_REGISTRY_URL, "docker-registry") {
                                image = docker.build("meetveracity/coding-challenge-app")
                                image.push("${env.BRANCH_NAME}")
                                if (params.releaseVersion != '') {
                                    image.push(params.releaseVersion)
                                }
                            }
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
                                    def helmDir = pwd(tmp: true)
                                    //Download the Chart
                                    sh "git clone \"https://github.com/meetveracity/coding-challenge-devops.git\" ${helmDir}"

                                    //Deploy the Chart
                                    sh "helm install -n ${releaseName}  --set \"image.tag=${env.BRANCH_NAME}\" --set \"initImage.tag=${env.BRANCH_NAME}\" --set \"image.pullPolicy=Always\" --set \"initImage.pullPolicy=Always\" --namespace development ${helmDir}/k8s/coding-challenge-app"

                                    //Find the Service Port
                                    functionalTestUrl = sh(returnStdout: true, script: "kubectl get --namespace development services -l app.kubernetes.io/instance=${releaseName} -o jsonpath=\"http://{.items[0].metadata.name}:{.items[0].spec.ports[0].port}\"")

                                    echo "Service is available at ${functionalTestUrl}"
                                }
                            }
                        }
                        stage('Functional Test Execution') {
                            steps {
                                dir('test/selenium') {
                                    sh "echo \"Working Directory is \$(pwd)\""
                                    sh 'yarn install'
                                    sh "mkdir reports"
                                    sh "export PATH=$PATH:\$(pwd)/node_modules/.bin; selenium-side-runner --base-url ${functionalTestUrl} --output-directory=reports --output-format=junit -c \"browserName=chrome chromeOptions.args=[headless,no-sandbox,disable-dev-shm-usage]\" coding-challenge-app.side"
                                }
                            }
                            post {
                                always {
                                    junit '**/test/selenium/reports/*.xml'
                                }
                            }
                        }
                    }
                }

                stage("Performance Testing") {
                    steps {
                        echo "TDB..."
                    }
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
                    docker.withRegistry(env.DOCKER_REGISTRY_URL, "docker-registry") {
                        image = docker.image("meetveracity/coding-challenge-app:${env.BRANCH_NAME}")
                        image.pull()
                        image.push("development")
                        initImage = docker.image("meetveracity/coding-challenge-db-init:${env.BRANCH_NAME}")
                        initImage.pull()
                        initImage.push("development")
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                node('helm') {
                    sh ("helm delete --purge ft-${env.BRANCH_NAME.toLowerCase()}")
                }
            }
        }
    }
}