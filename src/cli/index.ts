#!/usr/bin/env node
const fs = require('fs');
const [,, command] = process.argv;

switch (command) {
  case 'start':
  case undefined:
    require('../index').createServer().then(({ app, config }: any) => {
      app.listen({ port: config.port ?? 4000, host: '0.0.0.0' }, (err: any) => {
        if (err) { console.error(err); process.exit(1); }
        console.log(`\n⚡ benni-nexus running on http://localhost:${config.port ?? 4000}`);
      });
    });
    break;
  case 'init':
    const template = {
      port: 4000,
      strategy: 'cheap-first',
      backends: [
        { name: 'ollama', type: 'ollama', url: 'http://localhost:11434', models: ['llama3.1:8b'] },
      ],
    };
    fs.writeFileSync('nexus.config.json', JSON.stringify(template, null, 2));
    console.log('✅ nexus.config.json created');
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
