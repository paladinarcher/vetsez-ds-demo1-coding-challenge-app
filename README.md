# README

Note: I expect these instructions to change after Jason 'dockerizes' us. Because of this I won't be getting too
specific on versions of some things, if I expect it not to matter.

Install JRuby 9.2.6 on your system:

https://www.jruby.org/2019/02/11/jruby-9-2-6-0.html

Download jruby's jar file:

https://repo1.maven.org/maven2/org/jruby/jruby-complete/9.2.6.0/jruby-complete-9.2.6.0.jar

I put mine here:
```bazaar
cshupp@MSI C:\languages\ruby\jruby-9.2.6.0
$ ls -la
total 25857
drwxr-xr-x 1 cshupp 197121        0 Mar 13 08:34 .
drwxr-xr-x 1 cshupp 197121        0 Mar 13 08:33 ..
drwxr-xr-x 1 cshupp 197121        0 Mar 13 08:33 .install4j
-rw-r--r-- 1 cshupp 197121     1282 Feb 11 15:32 BSDL
-rw-r--r-- 1 cshupp 197121   132268 Feb 11 15:32 COPYING
-rw-r--r-- 1 cshupp 197121      218 Feb 11 15:32 LEGAL
-rw-r--r-- 1 cshupp 197121     2581 Feb 11 15:32 LICENSE.RUBY
drwxr-xr-x 1 cshupp 197121        0 Mar 13 08:33 bin
-rwxr-xr-x 1 cshupp 197121   268800 Feb 11 15:32 irb.exe
-rw-r--r-- 1 cshupp 197121 25332370 Mar 13 08:27 jruby-complete-9.2.6.0.jar
drwxr-xr-x 1 cshupp 197121        0 Mar 13 08:33 lib
drwxr-xr-x 1 cshupp 197121        0 Mar 13 08:33 samples
drwxr-xr-x 1 cshupp 197121        0 Feb 11 15:32 tool
-rwxr-xr-x 1 cshupp 197121   715776 Feb 11 15:32 uninstall.exe
```

Make yourself a bat/bash file and make the obvious changes (This is mine):
```bazaar
set JRUBY_OPTS=-J-Xmx2g -J-Djava.awt.headless=true 
set GEM_HOME=C:\work\digital_services_bpa\gem_home
set JRUBY_HOME=C:\languages\ruby\jruby-9.2.6.0
set JRUBY_JAR=%JRUBY_HOME%\jruby-complete-9.2.6.0.jar
set JAVA_HOME=C:\languages\Java\jdk1.8_191
set PATH=%GEM_HOME%\bin;%JRUBY_HOME%\bin;%JAVA_HOME%\bin;.\bin;%PATH%;
```

You will run your bat or source your bash.

Install a full JDK.  I am using the latest Java 8.
Install Maven. The latest should be fine.
Install Yarn and Node. The latest should be fine.

#todo
document build for javascript (maven will do it for us for the war)

Run Gem install bundler.

```bazaar
gem install bundler
```

From rails root do a (For the full build maven will do this):
```bazaar
bundle install
```

Run the following:
```
yarn install
```

Also install (this is not in the gemfile as it is not needed for the build, but you need it to run outside Tomcat.):
```bazaar
gem install trinidad --pre
```


Setup your database.  We will use postgres, so install that on your system.
Create a user: 
```bazaar
dsbpa
```

Assign that user all permissions.

Create the following databases, owner is dsbpa:
```bazaar
dsbpa_development
dsbpa_test
dsbpa_production
```

Run:

```bazaar
rake db:migrate
```


There is a startup.bat file to bring up the webserver outside of Tomcat.  Convert it to bash if on a Mac.
$ startup.bat

Running shows:
```bazaar
$ startup.bat

@ C:\work\digital_services_bpa\dsbpa
$ C:\languages\Java\jdk1.8_191\bin\java  -server  -jar C:\languages\ruby\jruby-9.2.6.0\jruby-complete-9.2.6.0.jar C:\work\digital_services_bpa\gem_home\bin\trinidad
Deploying from C:/work/digital_services_bpa/dsbpa as /dsbpa
Initializing ProtocolHandler ["http-bio-0.0.0.0-3000"]
jruby 9.2.6.0 (2.5.3) 2019-02-11 15ba00b Java HotSpot(TM) 64-Bit Server VM 25.191-b12 on 1.8.0_191-b12 +jit [mswin32-x86_64]
using a shared (threadsafe!) runtime
uri:classloader:/jruby/rack/response.rb:294: warning: constant ::Fixnum is deprecated
uri:classloader:/jruby/rack/core_ext.rb:26: warning: constant ::NativeException is deprecated
Starting ProtocolHandler ["http-bio-0.0.0.0-3000"]

```
When you see 'Starting ProtocolHandler' it is listening.

Try:

http://localhost:3000/dsbpa/comments







