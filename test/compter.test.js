const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { compterDonnees } = require('../lib/compter.js');

function pays(name, people) {
  return { name, people };
}
function personne(name, animals) {
  return { name, animals: animals.map(n => ({ name: n })) };
}

describe('compterDonnees', () => {
  it('ajoute le nombre de personnes au nom du pays', () => {
    const donnees = [pays('France', [personne('Kylian Mbappe', []), personne('Adrien Rabiot', [])])];

    const resultat = compterDonnees(donnees);

    assert.equal(resultat[0].name, 'France [2]');
  });

  it('ajoute le nombre d\'animaux au nom de chaque personne', () => {
    const donnees = [pays('France', [personne('Kylian Mbappe', ['Coq', 'Aigle', 'Sanglier'])])];

    const resultat = compterDonnees(donnees);

    assert.equal(resultat[0].people[0].name, 'Kylian Mbappe [3]');
  });

  it('ne modifie pas la liste des animaux', () => {
    const donnees = [pays('France', [personne('Kylian Mbappe', ['Coq', 'Aigle'])])];

    const resultat = compterDonnees(donnees);

    assert.deepEqual(resultat[0].people[0].animals, [{ name: 'Coq' }, { name: 'Aigle' }]);
  });

  it('gère un pays sans personnes', () => {
    const donnees = [pays('France', [])];

    const resultat = compterDonnees(donnees);

    assert.equal(resultat[0].name, 'France [0]');
    assert.deepEqual(resultat[0].people, []);
  });

  it('gère une personne sans animaux', () => {
    const donnees = [pays('France', [personne('Kylian Mbappe', [])])];

    const resultat = compterDonnees(donnees);

    assert.equal(resultat[0].people[0].name, 'Kylian Mbappe [0]');
  });

  it('retourne un tableau vide si les données sont vides', () => {
    assert.deepEqual(compterDonnees([]), []);
  });

  it('ne modifie pas les données passées en entrée', () => {
    const donnees = [pays('France', [personne('Kylian Mbappe', ['Coq'])])];
    const copie = JSON.parse(JSON.stringify(donnees));

    compterDonnees(donnees);

    assert.deepEqual(donnees, copie);
  });
});
