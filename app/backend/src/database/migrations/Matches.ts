import { Model, QueryInterface, DataTypes } from 'sequelize';
import { IMatches } from '../../Interfaces/IMatches';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable<Model<IMatches>>('matches', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      homeTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'home_team_id',   
      },
      homeTeamGoals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'home_team_goals',
      },
      awayTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'away_team_id',
      },
      awayTeamGoals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'away_team_goals'
      },
      inProgress: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'in_progress',
      },
    });
    await queryInterface.addConstraint('matches', {
      fields: ['home_team_id'],
      type: 'foreign key',
      name: 'home_team_id',
      references: {
        table: 'teams',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('matches', {
      fields: ['away_team_id'],
      type: 'foreign key',
      name: 'away_team_id',
      references: {
        table: 'teams',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });    
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('matches');
  },
};