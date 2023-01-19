module.exports = (sequelize, Sequelize) => {
  const Departement = sequelize.define("m_departements", {
    departement_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value === null || value == "") {
            throw new Error("departement name can't be null or empty");
          }
        },
      },
    },
    id_area: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value === null || value == "") {
            throw new Error("area name can't be null or empty");
          }
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
  // Departement.sync({ force: true });
  return Departement;
};
