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
    stages {
        stage('Initialize Database Schema') {
            steps {
                sh "bundle install"
                sh "rake db:migrate RAILS_ENV=test"
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
            agent {
                node {
                    label 'docker'
                }
            }
            steps {
                unstash 'mavenOutput'
                //sh 'docker build -t meetveracity/coding-challenge-app .'
                script {
                    docker.withRegistry(env.DOCKER_REGISTRY_URL, "docker-registry") {
                        image = docker.build("meetveracity/coding-challenge-app")
                        image.push("latest")
                    }
                }
            }
        }
    }
}