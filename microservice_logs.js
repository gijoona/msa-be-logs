'use strict';

const serverIp = '35.200.103.250';
const cluster = require('cluster'); // cluster 모듈
// const fs = require('fs');
const elasticsearch = new require('elasticsearch').Client({ // elasticsearch 인스턴스 생성
  host: {
    host: serverIp,
    port: 9200
  },
  log: 'trace'
});

/**
  Logs 클래스
  MicroService Architecture : Logs
  developer - ijgong
  date - 20180912
  target git - msa_be_logs:develop
*/
class logs extends require('./server.js') {
  constructor () {
    super('logs'  // POST/logs 한 가지 기능만 가지도록 함
      , process.argv[2] ? Number(process.argv[2]) : 9040
      , ["POST/logs"]
    );

    // writestream 생성 
    // this.writestream = fs.createWriteStream('./log.txt', { flags: 'a' });

    this.connectToDistributor(serverIp, 9000, (data) => {
      console.log("Distributor Notification", data);
    });
  }

  onRead(socket, data) {  // 로그가 입력되면 화면에 출력
    const sz = new Date().toLocaleString() + '\t' + socket.remoteAddress + '\t' + socket.remotePort + '\t' + JSON.stringify(data) + '\n';
    console.log(sz);
    // this.writestream.write(sz);
    data.timestamp = new Date().toISOString();  // timestamp 설정
    data.params = JSON.parse(data.params);      // JSON 포맷 변환
    elasticsearch.index({                       // 로그 저장
      index: 'microservice',
      type: 'logs',
      body: data
    });
  }
}

if (cluster.isMaster) {
  cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  new logs();
}
