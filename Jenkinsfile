pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *') // ใช้ webhook ดีกว่า ถ้าตั้งได้
    }

    environment {
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }

    parameters {
        booleanParam(name: 'CLEAN_VOLUMES', defaultValue: true, description: 'Remove volumes (clears DB)')
        string(name: 'API_HOST', defaultValue: 'http://localhost:3001', description: 'API host URL for frontend')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out ${env.GIT_COMMIT}"
            }
        }

        stage('Validate') {
            steps {
                sh 'docker compose config'
            }
        }

        stage('Prepare Environment') {
            steps {
                withCredentials([
                    string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASS'),
                    string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASS')
                ]) {
                    sh """
cat > .env <<EOF
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASS}
MYSQL_DATABASE=messageboard_db
MYSQL_USER=message_user
MYSQL_PASSWORD=${MYSQL_PASS}
MYSQL_PORT=3306
API_PORT=3001
DB_PORT=3306
FRONTEND_PORT=3000
API_HOST=${params.API_HOST}
NODE_ENV=production
EOF
"""
                    sh 'ls -la .env || true'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    if (params.CLEAN_VOLUMES) {
                        sh 'docker compose down -v || true'
                    } else {
                        sh 'docker compose down || true'
                    }
                    sh '''
                      docker compose build --no-cache
                      docker compose up -d
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 6'
                sh '''
                  docker compose ps
                  timeout 60 bash -c 'until curl -f http://localhost:3001/health; do sleep 2; done'
                  curl -f http://localhost:3001/messages
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                  echo "=== containers ==="
                  docker compose ps
                  echo "Frontend: http://localhost:3000"
                  echo "API: http://localhost:3001"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployed. Frontend: http://localhost:3000 API: http://localhost:3001"
        }
        failure {
            sh 'docker compose logs --tail=200 || true'
        }
        always {
            sh '''
              docker image prune -f || true
              docker container prune -f || true
            '''
        }
    }
}
