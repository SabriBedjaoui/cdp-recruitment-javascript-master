const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { executer, parseArguments, validerArguments } = require('../app.js');

describe('parseArguments', () => {
  it('transforme --argument=parametre en { argument: parametre }', () => {
    assert.deepEqual(parseArguments(['--filter=ry']), { filter: 'ry' });
  });

  it('transforme --argument sans valeur en { argument: true }', () => {
    assert.deepEqual(parseArguments(['--count']), { count: true });
  });

  it('gère plusieurs arguments', () => {
    assert.deepEqual(parseArguments(['--filter=ry', '--count']), { filter: 'ry', count: true });
  });

  it('retourne un objet vide sans argument', () => {
    assert.deepEqual(parseArguments([]), {});
  });
});

describe('validerArguments', () => {
  it('accepte --filter avec une valeur non vide', () => {
    assert.doesNotThrow(() => validerArguments({ filter: 'ry' }));
  });

  it('accepte --count seul', () => {
    assert.doesNotThrow(() => validerArguments({ count: true }));
  });

  it('rejette un argument inconnu', () => {
    assert.throws(() => validerArguments({ filtre: 'ry' }), /Argument\(s\) inconnu\(s\).*--filtre/);
  });

  it('rejette --filter si aucun paramètre', () => {
    assert.throws(() => validerArguments({ filter: true }), /--filter nécessite un paramètre non vide/);
  });

  it('rejette --filter si le paramètre est vide', () => {
    assert.throws(() => validerArguments({ filter: '' }), /--filter nécessite un paramètre non vide/);
  });

  it('rejette --count avec un paramètre', () => {
    assert.throws(() => validerArguments({ count: '5' }), /--count ne nécessite pas de paramètre/);
  });
});

describe('executer', () => {
  it('retourne toutes les données si aucun argument', () => {
    const resultat = executer([]);

    assert.equal(resultat.length, 5);
    assert.equal(resultat[0].name, 'Dillauti');
  });

  it('filtre les données si --filter est passé avec un paramètre', () => {
    const resultat = executer(['--filter=ry']);

    assert.deepEqual(resultat.map(p => p.name), ['Uzuzozne', 'Satanwi']);
    assert.deepEqual(resultat[0].people[0].animals.map(a => a.name), ['John Dory']);
    assert.deepEqual(resultat[1].people[0].animals.map(a => a.name), ['Oryx']);
  });

  it('compte les données avec --count', () => {
    const resultat = executer(['--count']);

    assert.equal(resultat[0].name, 'Dillauti [5]');
    assert.equal(resultat[0].people[0].name, 'Winifred Graham [6]');
  });

  it('combine --filter et --count', () => {
    const resultat = executer(['--filter=ry', '--count']);

    assert.equal(resultat[0].name, 'Uzuzozne [1]');
    assert.equal(resultat[0].people[0].name, 'Lillie Abbott [1]');
  });

  it('affiche une erreur pour un argument inconnu', () => {
    assert.throws(() => executer(['--filtre=ry']), /Argument\(s\) inconnu\(s\)/);
  });

  it('affiche une erreur pour --filter sans valeur', () => {
    assert.throws(() => executer(['--filter']), /--filter nécessite un paramètre non vide/);
  });

  it('affiche une erreur pour --count avec un paramètre', () => {
    assert.throws(() => executer(['--count=5']), /--count ne nécessite pas de paramètre/);
  });
});
