(ns clj-less.less
  (:refer-clojure :exclude [load])
  (:require
   [clj-less.compiler :as compiler]
   [clj-less.engine :as engine]
   [clj-less.nio :as nio]
   [clojure.java.io :as io]
   [clojure.string :as st])
  (:import
   (clj_less LessError)
   (java.io File)))

(defn- report-error [^LessError error]
  (binding [*out* *err*]
    (println (.getMessage error))))

(defn load [filename]
  (throw (ex-info "Should redef this var" {:filename filename})))

(defn run-compiler
  "Run the lesscss compiler."
  [{:keys [engine source-path target-path loader]}]
  (do
    (println "Compiling {less} css ...")
    (println "Compilation unit is" {:src source-path :dst target-path})
    (with-redefs [load (or loader slurp)]
      (engine/with-engine (name engine)
        (compiler/initialise)
        (-> [{:src source-path :dst target-path}]
            (compiler/compile-project report-error))
        (println "Compilation done!")))))
