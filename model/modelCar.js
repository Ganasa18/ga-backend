module.exports = (sequelize, Sequelize) => {
  const Cars = sequelize.define("m_cars", {
    license_plate: {
      unique: true,
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value === null || value === "") {
            throw new Error("Plat Number can't be null or empty");
          }
        },
      },
    },
    merk_vehicle: {
      allowNull: true,
      type: Sequelize.STRING(60),
    },
    model_vehicle: {
      allowNull: true,
      type: Sequelize.STRING(60),
    },
    driver_import: {
      allowNull: true,
      type: Sequelize.STRING(60),
    },
    driver_future_import: {
      allowNull: true,
      type: Sequelize.STRING(60),
    },
    chassis_number: {
      allowNull: false,
      type: Sequelize.STRING(60),
    },
    number_machine: {
      allowNull: false,
      type: Sequelize.STRING(60),
    },
    driver_future_import: {
      allowNull: false,
      type: Sequelize.STRING(60),
    },
    pull_or_takehome: {
      allowNull: true,
      type: Sequelize.STRING(60),
    },
    ownership: {
      allowNull: true,
      type: Sequelize.STRING(60),
    },
    immatriculation_date: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    location_odoo: {
      allowNull: true,
      type: Sequelize.STRING(60),
    },
    offline_car: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    driver_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
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
  // Cars.sync({ force: true });
  return Cars;
};
