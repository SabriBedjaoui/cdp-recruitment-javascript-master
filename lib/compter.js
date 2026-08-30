/**
 * @fileoverview Module qui permet le comptage. Il annote chaque pays et chaque personne
 * avec le nombre de leurs enfants directs, personnes et animaux respectivement.
 */

/**
 * @param {Array<{name: string, people: Array}>} donnees - Liste des pays à compter.
 * @returns {Array} Nouveau tableau de pays avec les décomptes ajoutés sur les parents respectifs.
 */
function compterDonnees(donnees) {
  return donnees.map(pays => compterPersonnesPays(pays))
}

/**
 * @param {{name: string, people: Array}} pays
 * @returns {{name: string, people: Array}} Le pays avec son nombre de personnes ajouté au nom.
 */
function compterPersonnesPays(pays) {
  return { name: `${pays.name} [${pays.people.length}]`, people: pays.people.map(personne => compterAnimauxPersonne(personne)) };
}

/**
 * @param {{name: string, animals: Array}} personne
 * @returns {{name: string, animals: Array}} La personne avec son nombre d'animaux ajouté au nom.
 */
function compterAnimauxPersonne(personne) {
  return { name: `${personne.name} [${personne.animals.length}]`, animals: personne.animals };
}

module.exports = {
  compterDonnees
}
