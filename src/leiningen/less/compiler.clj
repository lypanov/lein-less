(ns leiningen.less.compiler
  (:refer-clojure :exclude [compile])
  (:require (leiningen.less [nio :as nio]
                            [engine :as engine])
            [clojure.java.io :as io]
            [clojure.data.codec.base64 :as base64])
  (:import [java.nio.file Path]
           (java.io IOException)
           (javax.script ScriptEngineManager ScriptEngine ScriptContext)
           (leiningen.less LessError)))


(def version "1.7.2")
(def less-js (format "leiningen/less/less-rhino-%s.js" version))
(def lessc-js (format "leiningen/less/lessc.js"))

; BEGIN helpers for external JS based LESS functions

(defn slurp-bytes
  "Slurp the bytes from a slurpable thing"
  [x]
  (with-open [out (java.io.ByteArrayOutputStream.)]
    (clojure.java.io/copy (clojure.java.io/input-stream x) out)
    (.toByteArray out)))

(defn base64-encode [data]
  (String. (base64/encode data) "UTF-8"))

; END

(defn initialise
  "Load less compiler resources required to compile less files to css. Must be called before invoking compile."
  []
  (engine/eval! (io/resource less-js) less-js)
  (engine/eval! (io/resource lessc-js) lessc-js))


(defn- escape-filename [path]
  (clojure.string/replace path "\\" "\\\\"))


(defn compile-resource
  "Compile a single less resource."
  [src dst]
  (nio/create-directories (nio/parent dst))
  (engine/eval! (format "lessc.compile('%s', '%s');" (-> src nio/absolute escape-filename) (-> dst nio/absolute escape-filename))))


(defn compile-project
  "Take a normalised project configuration and a sequence of src/dst pairs, compiles each pair."
  [project units on-error]
  (engine/eval! (-> project :less :foo))
  (doseq [{:keys [^Path src ^Path dst]} units]
    (try
      (compile-resource src dst)
      (catch LessError ex
             (on-error ex)))))
