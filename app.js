/**
 * @fileoverview Module principal qui parse les arguments, les valide, puis applique les modules `filtrer` et/ou `compter` 
 * aux données de `data.js` en fonction des options passées.
 */

const { data } = require('./data.js');
const filtrer = require('./lib/filtrer.js');
const compter = require('./lib/compter.js');
const util = require('util');

const ARGUMENT_PATTERN = /^--([^=]+)(?:=(.*))?$/;

/**
 * Transforme les arguments de la ligne de commande (--argument=parametre ou --argument)
 * en un objet { key: value },  key l'argument et value le paramètre qui vaut true si aucune valeur n'est fournie
 * c'est le cas pour --count.
 *
 * @param {string[]} argv - Arguments passés en ligne de commande
 * @returns {Object<string, string|true>}
 */
function parseArguments(argv) {
  const args = {};

  for (const arg of argv) {
    const match = arg.match(ARGUMENT_PATTERN);
    if (match) {
      const [, key, value] = match;
      args[key] = value === undefined ? true : value;
    } else {
      args[arg] = true;
    }
  }

  return args;
}

const ARGUMENTS_VALIDES = ['filter', 'count'];

/**
 * Valide les arguments parsés, rejette les options inconnues et vérifie
 * que `--filter` reçoit bien un paramètre non vide.
 *
 * @param {Object<string, string|true>} args - Résultat de parseArguments.
 * @throws {Error} Si un argument est inconnu ou si --filter n'a pas de paramètre ou qu'il est vide.
 */
function validerArguments(args) {
  const argsInconnus = Object.keys(args).filter(key => !ARGUMENTS_VALIDES.includes(key));
  if (argsInconnus.length > 0) {
    throw new Error(`Argument(s) inconnu(s): ${argsInconnus.map(key => '--' + key).join(', ')}. Options valides: --filter=<paramètre>, --count`);
  }

  if (args.filter !== undefined && (typeof args.filter !== 'string' || args.filter.length === 0)) {
    throw new Error('--filter nécessite un paramètre non vide, ex: --filter=ry');
  }

  if (args.count !== undefined && (typeof args.count !== 'boolean')) {
    throw new Error('--count ne nécessite pas de paramètre, ex: --count');
  }
}

/**
 * Parse et valide les arguments, puis applique successivement le filtrage
 * (--filter) et le comptage (--count) aux données selon les options passées en ligne de commande.
 *
 * @param {string[]} [argv] - Arguments à traiter.
 * @returns {Array} Les données transformées selon les options passées.
 * @throws {Error} Si les arguments sont invalides.
 */
function executer(argv = process.argv.slice(2)) {
  const args = parseArguments(argv);
  validerArguments(args);
  let donnees = data;
  if (args.filter !== undefined) {
    donnees = filtrer.filtrerDonnees(donnees, args.filter);
  }
  if (args.count !== undefined) {
    donnees = compter.compterDonnees(donnees);
  }
  return donnees;
}

function main() {
  try {
    const resultat = executer(process.argv.slice(2));
    console.log(util.inspect(resultat, { depth: null, colors: true }));
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { executer, parseArguments, validerArguments };
