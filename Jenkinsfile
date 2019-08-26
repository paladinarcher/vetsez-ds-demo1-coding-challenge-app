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
                            docker.withRegistry(env.DOCKER_REGISTRY_URL, "docker-registry") {
                                dbImage = docker.build("meetveracity/coding-challenge-db-init", "-f Dockerfile.db-init .")
                                dbImage.push("${env.BRANCH_NAME}")
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
                            }
                        }
                    }
                }
            }
        }
        stage("Functional Testing") {
            steps {
                echo "TDB..."
            }
        }
        stage("Performance Testing") {
            steps {
                echo "TDB..."
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
}