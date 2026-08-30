const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { filtrerDonnees } = require('../lib/filtrer.js');

function pays(name, people) {
  return { name, people };
}
function personne(name, animals) {
  return { name, animals: animals.map(n => ({ name: n })) };
}

describe('filtrerDonnees', () => {
  it('ne garde que les animaux dont le nom contient le filtre', () => {
    const donnees = [pays('France', [personne('Kylian Mbappe', ['Coq', 'Aigle'])])];

    const resultat = filtrerDonnees(donnees, 'oq');
    
    assert.deepEqual(resultat, [pays('France', [personne('Kylian Mbappe', ['Coq'])])]);
  });

  it('garde l\'ordre initial des animaux lors du filtrage', () => {
    const donnees = [pays('France', [personne('Kylian Mbappe', ['Coq', 'Aigle', 'Sanglier'])])];

    const resultat = filtrerDonnees(donnees, 'a');

    assert.deepEqual(resultat[0].people[0].animals.map(a => a.name), ['Aigle', 'Sanglier']);
  });

  it('est insensible à la casse lors du filtrage', () => {
    const donnees = [pays('France', [personne('Adrien Rabiot', ['Aigle'])])];

    const resultat = filtrerDonnees(donnees, 'GL');

    assert.equal(resultat[0].people[0].animals.length, 1);
  });

  it('retire une personne si elle n\'a plus d\'animaux restants après filtrage', () => {
    const donnees = [pays('France', [personne('Kylian Mbappe', ['Coq']), personne('Adrien Rabiot', ['Aigle'])])];

    const resultat = filtrerDonnees(donnees, 'ig');

    assert.deepEqual(resultat[0].people.map(p => p.name), ['Adrien Rabiot']);
  });

  it('retire un pays si aucune personnes n\'a d\'animaux restants après filtrage', () => {
    const donnees = [pays('France', [personne('Kylian Mbappe', ['Coq'])]), pays('Argentine', [personne('Messi', ['GOAT'])])];

    const resultat = filtrerDonnees(donnees, 'oa');

    assert.deepEqual(resultat.map(p => p.name), ['Argentine']);
  });

  it('retourne un tableau vide si aucun animal ne correspond', () => {
    const donnees = [pays('France', [personne('Ousmane Dembele', ['Aigle'])])];

    const resultat = filtrerDonnees(donnees, 'zz');

    assert.deepEqual(resultat, []);
  });

  it('ne modifie pas les données passées en entrée', () => {
    const donnees = [pays('France', [personne('Adrien Rabiot', ['Coq', 'Aigle'])])];
    const copie = JSON.parse(JSON.stringify(donnees));

    filtrerDonnees(donnees, 'oq');

    assert.deepEqual(donnees, copie);
  });
});
