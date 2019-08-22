FROM tomcat:12-jdk-oracle

ADD target/*.war /usr/local/tomcat/webapps/

CMD ["catalina.sh", "run"]