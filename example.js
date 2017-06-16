var fs = require('fs'),
    stdin = process.stdin,
    stdout = process.stdout;
var stats = [],
    $files = [],
    flag = false,
    path = __dirname,
    dirName = __dirname + '/';

function readDir() {
    fs.readdir(path, function (err, files) {
        $files = files;
        if (files.length === 0)
            return stdin.pause(), console.log('    \033[31mNo files \033[39m');
        stats = [], console.log('   Select which file or dir you want to see \n');
        (function file(i) {
            var fileName = files[i];
            fs.stat(dirName + fileName, function (err, stat) {
                stats[i] = stat;
                if (stat.isDirectory()) console.log('   Dir  -->' + i + '  \033[36m' + fileName + '/\033[39m');
                else console.log('   File -->' + i + '  \033[90m' + fileName + '\033[39m');
                if ((++i) == files.length) {
                    stdout.write('\n    \033[31mEnter your choice: \033[39m');
                    flag || init();
                } else file(i);
            });
        })(0);
    });
}
function init() {
    flag = true;
    stdin.resume();
    stdin.setEncoding('utf-8');
    stdin.on('data', function (data) {
        var _stat = stats[Number(data)],
            _fileName = $files[Number(data)];
        if (!_fileName) {
            stdout.write('\033[31mEnter your choice: \033[39m');
        } else if (_stat.isDirectory()) {
            path += '/' + _fileName;
            dirName += _fileName + '/';
            readDir();
        } else {
            stdin.pause();
            fs.readFile(dirName + _fileName, 'utf-8', function (err, data) {
                console.log('\n \033[90m' + data.replace(/(.*)/g, '   $1') + '\033[39m');
            });
        }
    })
}
readDir();

(function () {
    setTimeout(function () {
        console.log('111111111111');
    }, 0);
    console.log('222222222222');
    (function () {
        console.log('33333333333333');
        setTimeout(function () {
            console.log('444444444444');
        }, 0);
    })()
    console.log('555555555555');
    var count = 1;
    for (var i = 1; i < 100000; i++) {
        count *= i;
    }
    console.log(count);
})();


