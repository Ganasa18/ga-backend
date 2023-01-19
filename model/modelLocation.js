module.exports = (sequelize, Sequelize) => {
  const Location = sequelize.define("m_location", {
    location_name: {
      type: Sequelize.STRING(60),
      allowNull: true,
    },
    type_location: {
      type: Sequelize.STRING(60),
      allowNull: true,
    },
    tagLocation: {
      type: Sequelize.STRING(60),
      allowNull: true,
    },
    location_name_rev: {
      type: Sequelize.STRING(60),
      allowNull: true,
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
  // Location.sync({ force: true });
  return Location;
};
