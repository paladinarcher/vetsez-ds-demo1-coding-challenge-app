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
            echo "TDB..."
        }
        stage("Build Containers") {
            echo "TDB..."
        }
    }
}