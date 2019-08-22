FROM tomcat:9-jdk12-openjdk-oracle

ADD target/*.war /usr/local/tomcat/webapps/dsbpa.war

CMD ["catalina.sh", "run"]