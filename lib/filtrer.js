/**
 * @fileoverview Module qui permet le filtrage. Il ne conserve que les pays pour lesquels les personnes ont un animal dont le nom
 * contient la chaine de caractères passée en paramètre.
 */

/**
 * @param {Array<{name: string, people: Array}>} donnees - Liste des pays à filtrer.
 * @param {string} filtre - Chaîne de caractères de filtrage pour les noms des animaux.
 * @returns {Array} Nouveau tableau de pays filtrés.
 */
function filtrerDonnees(donnees, filtre) {
  return donnees.map(pays => filtrerPays(pays, filtre)).filter(pays => pays !== null);
}

/**
 * @param {{name: string, people: Array}} pays
 * @param {string} filtre
 * @returns {{name: string, people: Array}|null} Le pays avec ses personnes filtrées,
 * ou `null` si plus aucune personne ne correspond.
 */
function filtrerPays(pays, filtre) {
  const personnesFiltrees = pays.people.map(personne => filtrerPersonnes(personne, filtre)).filter(personne => personne !== null);
  if (personnesFiltrees.length > 0) {
    return { name: pays.name, people: personnesFiltrees };
  }
  return null;
}

/**
 * @param {{name: string, animals: Array}} personne
 * @param {string} filtre
 * @returns {{name: string, animals: Array}|null} La personne avec ses animaux filtrés,
 * ou `null` si aucun animal ne correspond.
 */
function filtrerPersonnes(personne, filtre) {
  const animauxFiltres = filtrerAnimaux(personne.animals, filtre);
  if (animauxFiltres.length > 0) {
    return { name: personne.name, animals: animauxFiltres };
  }
  return null;
}

/**
 * @param {Array<{name: string}>} animals
 * @param {string} filtre
 * @returns {Array<{name: string}>} Les animaux dont le nom correspond au filtre.
 */
function filtrerAnimaux(animals, filtre) {
  return animals.filter(animal => filtrerNom(animal, filtre));
}

/**
 * @param {{name: string}} animal
 * @param {string} filtre
 * @returns {boolean} `true` si le nom de l'animal contient le filtre (insensible à la casse).
 */
function filtrerNom(animal, filtre) {
  return animal.name.toLowerCase().includes(filtre.toLowerCase());
}

module.exports = {
  filtrerDonnees
};
