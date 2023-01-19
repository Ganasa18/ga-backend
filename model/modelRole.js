module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "m_roles",
    {
      role_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          customValidator(value) {
            if (value === null || value == "") {
              throw new Error("role name can't be null or empty");
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
    },
    {
      freezeTableName: true,
    }
  );
  return Role;
};
