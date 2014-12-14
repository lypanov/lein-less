(defproject malcolmsparks/clj-less "1.7.3"
  :description "Clojure Less CSS compiler "
  :url "http://github.com/malcolmsparks/clj-less"
  :license {:name "Eclipse Public License"
            :url  "http://www.eclipse.org/legal/epl-v10.html"}

  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]

  :java-source-paths ["java"]

  :resource-paths ["resources"]

  :dependencies []

  :profiles {:dev {:dependencies [[org.clojure/clojure "1.6.0"]]}})
