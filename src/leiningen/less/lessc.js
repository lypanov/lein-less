var lessc = {};

lessc.base_options = {};

print("yay");

less.Parser.fileLoader = function (file, currentFileInfo, callback, env) {

    print("fileLoader :");
    print(file);
    print(JSON.stringify(env.paths));
    print(JSON.stringify(currentFileInfo));

    print("blah: " + JSON.stringify(!lessc.exists("C:\\Users\\Alexander\\Documents\\Libersy\\Provider\\new-planner\\blah")));
    print("blah2: " + JSON.stringify(!lessc.exists("C:\\Users\\Alexander\\Documents\\Libersy\\Provider\\new-planner\\blah2")));

    var href = file;
    if (!/^\//.test(file)) {
        print("TEST PASSED!");
        var possiblePaths = currentFileInfo && currentFileInfo.currentDirectory ? [currentFileInfo.currentDirectory] : [];
        print(JSON.stringify(possiblePaths));
        possiblePaths = possiblePaths.concat(env.paths);
        print(JSON.stringify(possiblePaths));
        for (var i = 0; i < possiblePaths.length; i++) {
          print("INDEX" + i);
          print(possiblePaths[i]);
            var possiblePath = less.modules.path.join(possiblePaths[i], file);
            print("checking if exists" + possiblePath);
            if (lessc.exists(possiblePath)) {
              print("exists! - using" + possiblePath);
              href = possiblePath;
              break;
            }
        }
    }

    var path = less.modules.path.dirname(href);

    var newFileInfo = {
        currentDirectory: path + '/',
        filename: href
    };

    if (currentFileInfo) {
        newFileInfo.entryPath = currentFileInfo.entryPath;
        newFileInfo.rootpath = currentFileInfo.rootpath;
        newFileInfo.rootFilename = currentFileInfo.rootFilename;
        newFileInfo.relativeUrls = currentFileInfo.relativeUrls;
    } else {
        newFileInfo.entryPath = path;
        newFileInfo.rootpath = less.rootpath || path;
        newFileInfo.rootFilename = href;
        newFileInfo.relativeUrls = env.relativeUrls;
    }

    var j = file.lastIndexOf('/');
    if (newFileInfo.relativeUrls && !/^(?:[a-z-]+:|\/)/.test(file) && j != -1) {
        var relativeSubDirectory = file.slice(0, j + 1);
        newFileInfo.rootpath = newFileInfo.rootpath + relativeSubDirectory; // append (sub|sup) directory path of imported file
    }
    newFileInfo.currentDirectory = path;
    newFileInfo.filename = href;

    var data = null;
    try {
        data = lessc.read(href);
    } catch (e) {
        callback({ type: 'File', message: "'" + less.modules.path.basename(href) + "' wasn't found" });
        return;
    }

    try {
        callback(null, data, href, newFileInfo, { lastModified: 0 });
    } catch (e) {
        callback(e, null, href);
    }
};

(function () {
    /* derived from lessc-rhino */
    lessc.formatError = function formatError(ctx, options) {
      print(JSON.stringify(ctx));
      print(JSON.stringify(options));

        options = options || {};

        var message = "";
        var extract = ctx.extract;
        var error = [];

        // only output a stack if it isn't a less error
        if (ctx.stack && !ctx.type) {
            return ctx.message + "\r\n" + ctx.stack;
        }

        if (!ctx.hasOwnProperty || !ctx.hasOwnProperty('index') || !extract) {
            return ctx.message + "\r\n" + ctx.stack;
        }

        if (typeof(extract[0]) === 'string') {
            error.push((ctx.line - 1) + ' ' + extract[0]);
        }

        if (typeof(extract[1]) === 'string') {
            var errorTxt = ctx.line + ' ';
            if (extract[1]) {
                errorTxt += extract[1].slice(0, ctx.column)
                    + extract[1][ctx.column] + extract[1].slice(ctx.column + 1);
            }
            error.push(errorTxt);
        }

        if (typeof(extract[2]) === 'string') {
            error.push((ctx.line + 1) + ' ' + extract[2]);
        }
        error = error.join('\n') + '\n';

        message += ctx.type + 'Error: ' + ctx.message;
        if (ctx.filename) {
            message += ' in ' + ctx.filename + ' on line ' + ctx.line + ', column ' + (ctx.column + 1) + ':';
        }

        message += '\n' + error;

        if (ctx.callLine) {
            message += 'from ' + (ctx.filename || '') + '/n';
            message += ctx.callLine + ' ' + ctx.callExtract + '/n';
        }

        return message;
    }
})();

(function () {
    var RT;
    var type;

    if ((typeof importClass) != "undefined") {
        importClass(Packages.clojure.lang.RT);
        RT = Packages.clojure.lang.RT;
        type = "rhino";
    }
    if ((typeof Java) != "undefined" && Java.type) {
        RT = Java.type("clojure.lang.RT");
        type = "nashorn";
    }

    var slurp_var = RT['var']("clojure.core", "slurp");
    lessc.read = function (filename, encoding) {
        return String(slurp_var['invoke'](filename));
    };

    var spit_var = RT['var']("clojure.core", "spit");
    lessc.write = function (filename, content) {
        spit_var['invoke'](filename, content);
        return undefined;
    };

    var exists_var = RT['var']("leiningen.less.nio", "exists?");
    lessc.exists = function (filename) {
        result = exists_var['invoke'](filename);
        return result;
    };

    var error_var = RT['var']("leiningen.less.engine", "error!");
    lessc.error = function (ctx, options) {
        var message = lessc.formatError(ctx, options);
        if (ctx.javaException) {
            error_var['invoke'](ctx.javaException, message);
        }
        else {
            error_var['invoke'](ctx, message);
        }
    };

    var quit = new Error("quit");

    lessc.quit = function (code) {
        throw quit;
    };

    lessc.compile = function (in_file, out_file) {
        var options = JSON.parse(JSON.stringify(lessc.base_options));
        print("OMGFOG!");
        print(options["paths"]);
        options["paths"] = ["C:\\Users\\Alexander\\Documents\\Libersy\\Provider\\new-planner\\resources\\public\\vendor\\bootstrap\\less",
                            "C:\\Users\\Alexander\\Documents\\Libersy\\Provider\\new-planner\\src\\main\\less-library"];
        print(options["paths"]);
        options["filename"] = in_file;
        var input = lessc.read(in_file, 'utf-8');
        try {
            var parser = new less.Parser(options);
              print(1);
            parser.parse(input, function (e, root) {
              print(2);
                if (e) {
              print(3);
                    lessc.error(e);
                }
                else {
              print(4);
                    var result = root.toCSS(options);
              print(5);
                    lessc.write(out_file, result);
              print(6);
                    lessc.quit(0);
                }
            });
        }
        catch (e) {
            if (e == quit) {
                return 0;
            }
            else {
              print(JSON.stringify(e));
                lessc.error(e, options);
            }
        }
    }
})();
