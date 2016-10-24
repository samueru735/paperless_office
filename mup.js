module.exports = {
  servers: {
    one: {
      host: '54.149.246.174',
      username: 'ubuntu',
      pem: 'paperlessofficekey.pem',
      //password: 'root',
      // or leave blank for authenticate from ssh-agent
      opts: { 
          port: 22
      }
    }
  },

  meteor: {
    name: 'PaperlessOffice',
    path: '.',
    dockerImage: 'abernix/meteord:base',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true
    },
    env: {
      ROOT_URL: 'http://ec2-54-149-246-174.us-west-2.compute.amazonaws.com',
      MONGO_URL: 'mongodb://localhost/meteor'
    },

    //dockerImage: 'kadirahq/meteord',
    //dockerImage: 'abernix/meteord:base',
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {}
    }
  }
};