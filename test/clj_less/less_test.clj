(ns clj-less.less-test
  (:require [clj-less.less :refer (run-compiler)]
            [clojure.test :refer :all]
            [clojure.repl :refer (apropos dir doc find-doc pst source)]))

;; todo: become it to unit test
(deftest test-compile-simple
  (testing "run-compiler "
    (run-compiler
     {:engine :javascript
      :project-root "sample/example"
      :source-path "resources.less"
      :target-path "css.css"})))


;; using a source file and a target file only works with one source
#_(run-compiler
   {:engine :javascript
    :project-root "sample/bootstrap"
    :source-path "less/bootstrap.less"
    :target-path "../css-target/bootstrap.css"})
