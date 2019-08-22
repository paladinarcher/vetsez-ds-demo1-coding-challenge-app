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
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        stage('Source Code Analysis') {
            steps {
                echo "TDB..."
            }
        }
        stage("Build Containers") {
            steps {
                echo "TDB..."
            }
        }
    }
}