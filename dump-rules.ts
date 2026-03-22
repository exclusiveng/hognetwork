
import { AppDataSource } from './src/config/data-source';
import { RuleSet } from './src/entities/ruleset.entity';
import { Rule } from './src/entities/rule.entity';
import fs from 'fs';

async function dumpRules() {
  try {
    await AppDataSource.initialize();
    
    const rulesets = await AppDataSource.getRepository(RuleSet).find({
      relations: ['rules']
    });

    let output = '';
    for (const rs of rulesets) {
      output += `\nRuleSet: ${rs.name} (${rs.id})\n`;
      for (const r of rs.rules || []) {
        output += `  Rule: ${r.id} | Type: ${r.type} | Msg: ${r.message}\n`;
        output += `    Payload: ${JSON.stringify(r.payload)}\n`;
      }
    }

    fs.writeFileSync('rules-dump.txt', output);
    console.log('Rules dumped to rules-dump.txt');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error dumping rules:', error);
  }
}

dumpRules();
