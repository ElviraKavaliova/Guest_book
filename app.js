const http = require('http');
const hostname = '127.0.0.1';
const port = 8081;

express = require('express');
fs = require('fs');
bodyParser = require('body-parser');

app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

// когда открыли в браузере стартовую страницу - запрашиваем её html
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.html')
});

//отправка данных в ответ на запрос получения существующих комментариев
app.get('/get-messages', function (request, response) {
  let content = fs.readFileSync('database.txt');
  if (!content) {
    content = '[]';
  }
  response.set('Content-Type', 'application/json');
  response.send(content);
});

app.post('/add-message', function (request, response, next) {
  rb = request.body
  let today = new Date()
  let month = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октяюря','Ноября','Декабря'];
  let date = today.getDate() + ' ' + month[today.getMonth()] + ' ' + today.getFullYear() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  rb.time = date

  const writeToFile = (fileName, callback) => {
    fs.open(fileName, 'r+', (error, fileDescriptor) => {
      if (!error && fileDescriptor) {
        let fileData;
        try {
          fileData = JSON.parse(fs.readFileSync(fileName));
        } catch (e) {
          fileData = []
        }

        if (!Array.isArray(fileData))
          fileData = []

        fileData.push(rb)

        fs.writeFile(fileDescriptor, JSON.stringify(fileData), (error) => {
          if (!error) {
            fs.close(fileDescriptor, (error) => {
              if (!error) {
                callback(false);
              } else {
                callback('ошибка закрытия файла');
              }
            });
          } else {
            callback('Ошибка записи в новый файл');
          }
        });
      } else {
        callback('Не удается создать новый файл, возможно он уже существует');
      }
    });
  };

  writeToFile('database.txt', function (message) {
    console.log(message);
  });

  response.send(rb);
});

//запуск сервера
app.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});