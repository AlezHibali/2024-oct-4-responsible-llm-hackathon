import React from 'react';
import DynamicTable from '../components/dynamictable';

const App = () => {
  const sampleData = [
    {"champion_kills_per_game":"12.71","combat_score":1000,"epic_monster_killed_per_game":"4.60","first_baron_rate":"0.61","league":"Worlds","match_numbers":137,"net_building_destroyed_per_game":"2.93","rank":1,"reference_label":"T1","region":"INTERNATIONAL","team_acronym":"T1","team_capital_letter":"T","team_name":"T1","vision_scores_per_game":"161.99","winning_rate":"0.61"},
    {"champion_kills_per_game":"14.13","combat_score":895,"epic_monster_killed_per_game":"4.50","first_baron_rate":"0.58","league":"Worlds","match_numbers":123,"net_building_destroyed_per_game":"3.86","rank":2,"reference_label":"Gen.G","region":"INTERNATIONAL","team_acronym":"GEN","team_capital_letter":"G","team_name":"Gen.G","vision_scores_per_game":"162.84","winning_rate":"0.72"},
    {"champion_kills_per_game":"13.13","combat_score":809,"epic_monster_killed_per_game":"4.30","first_baron_rate":"0.62","league":"LCK","match_numbers":114,"net_building_destroyed_per_game":"3.25","rank":3,"reference_label":"kt Rolster","region":"KOREA","team_acronym":"KT","team_capital_letter":"K","team_name":"kt Rolster","vision_scores_per_game":"154.69","winning_rate":"0.69"},
    {"champion_kills_per_game":"11.31","combat_score":807,"epic_monster_killed_per_game":"3.85","first_baron_rate":"0.47","league":"Worlds","match_numbers":107,"net_building_destroyed_per_game":"0.62","rank":4,"reference_label":"Hanwha Life Esports","region":"INTERNATIONAL","team_acronym":"HLE","team_capital_letter":"H","team_name":"Hanwha Life Esports","vision_scores_per_game":"169.41","winning_rate":"0.55"},
    {"champion_kills_per_game":"12.06","combat_score":709,"epic_monster_killed_per_game":"4.54","first_baron_rate":"0.57","league":"Worlds","match_numbers":87,"net_building_destroyed_per_game":"1.86","rank":5,"reference_label":"Dplus Kia","region":"INTERNATIONAL","team_acronym":"DK","team_capital_letter":"D","team_name":"Dplus Kia","vision_scores_per_game":"164.29","winning_rate":"0.59"}
     ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Team Statistics</h1>
      <DynamicTable data={sampleData} />
    </div>
  );
};

export default App;