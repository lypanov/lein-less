# malcolmsparks/clj-less

This is a forked repo of [@montoux](https://github.com/montoux)/[lein-less](https://github.com/montoux/lein-less/)

Compile [Less](http://lesscss.org) to CSS.

## Usage

Add `[malcolmsparks/clj-less "1.7.3"]` to your `project.clj` dependencies:

```
  :dependencies [[malcolmsparks/clj-less "1.7.3"]]
```


```
(ns your-ns
  (:require [clj-less.less :refer (run-compiler)]))

  (run-compiler
    {:engine :nashorn
     :project-root "sample/example"
     :source-path "your-less-file.less"
     :target-path "your-css-file.css"}))

```

Valid values for ```:engine``` are ```:javascript```, ```:rhino``` and ```:nashorn ```

## References

http://www.smashingmagazine.com/2013/03/12/customizing-bootstrap/
