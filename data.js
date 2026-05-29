// ============================================
// UCL FINAL PREDICTOR - DATA MODULE
// Arsenal vs PSG - Historical & Statistical Data
// ============================================

const MatchData = {
  // Historical head-to-head matches
  headToHead: [
    { date: '2024-10-01', competition: 'UCL Group', home: 'Arsenal', away: 'PSG', scoreH: 2, scoreA: 0, venue: 'Emirates Stadium' },
    { date: '2024-11-26', competition: 'UCL Group', home: 'PSG', away: 'Arsenal', scoreH: 0, scoreA: 1, venue: 'Parc des Princes' },
    { date: '2016-09-13', competition: 'UCL Group', home: 'PSG', away: 'Arsenal', scoreH: 1, scoreA: 1, venue: 'Parc des Princes' },
    { date: '2016-11-23', competition: 'UCL Group', home: 'Arsenal', away: 'PSG', scoreH: 2, scoreA: 2, venue: 'Emirates Stadium' },
    { date: '2016-03-09', competition: 'UCL R16', home: 'Arsenal', away: 'PSG', scoreH: 1, scoreA: 0, venue: 'Emirates Stadium' },
    { date: '2016-04-12', competition: 'UCL R16', home: 'PSG', away: 'Arsenal', scoreH: 1, scoreA: 1, venue: 'Parc des Princes' },
  ],

  // Arsenal recent form (last 10 matches - 2025/26 season)
  arsenalForm: [
    { opponent: 'Manchester City', result: 'W', score: '3-1', competition: 'Premier League', goalsFor: 3, goalsAgainst: 1, xG: 2.8, xGA: 1.1, possession: 55 },
    { opponent: 'Liverpool', result: 'W', score: '2-0', competition: 'Premier League', goalsFor: 2, goalsAgainst: 0, xG: 2.1, xGA: 0.7, possession: 52 },
    { opponent: 'Real Madrid', result: 'W', score: '2-1', competition: 'UCL Semi', goalsFor: 2, goalsAgainst: 1, xG: 1.9, xGA: 1.3, possession: 48 },
    { opponent: 'Real Madrid', result: 'D', score: '1-1', competition: 'UCL Semi', goalsFor: 1, goalsAgainst: 1, xG: 1.4, xGA: 1.2, possession: 46 },
    { opponent: 'Chelsea', result: 'W', score: '2-0', competition: 'Premier League', goalsFor: 2, goalsAgainst: 0, xG: 2.3, xGA: 0.5, possession: 58 },
    { opponent: 'Aston Villa', result: 'W', score: '3-0', competition: 'Premier League', goalsFor: 3, goalsAgainst: 0, xG: 2.9, xGA: 0.4, possession: 62 },
    { opponent: 'Inter Milan', result: 'W', score: '1-0', competition: 'UCL QF', goalsFor: 1, goalsAgainst: 0, xG: 1.5, xGA: 0.8, possession: 50 },
    { opponent: 'Inter Milan', result: 'D', score: '0-0', competition: 'UCL QF', goalsFor: 0, goalsAgainst: 0, xG: 0.9, xGA: 0.6, possession: 51 },
    { opponent: 'Tottenham', result: 'W', score: '3-1', competition: 'Premier League', goalsFor: 3, goalsAgainst: 1, xG: 2.7, xGA: 0.9, possession: 57 },
    { opponent: 'Brighton', result: 'W', score: '2-1', competition: 'Premier League', goalsFor: 2, goalsAgainst: 1, xG: 1.8, xGA: 1.0, possession: 54 },
  ],

  // PSG recent form (last 10 matches - 2025/26 season)
  psgForm: [
    { opponent: 'Lyon', result: 'W', score: '3-0', competition: 'Ligue 1', goalsFor: 3, goalsAgainst: 0, xG: 2.6, xGA: 0.5, possession: 64 },
    { opponent: 'Marseille', result: 'W', score: '2-1', competition: 'Ligue 1', goalsFor: 2, goalsAgainst: 1, xG: 2.2, xGA: 1.0, possession: 61 },
    { opponent: 'Bayern Munich', result: 'W', score: '3-2', competition: 'UCL Semi', goalsFor: 3, goalsAgainst: 2, xG: 2.4, xGA: 2.1, possession: 45 },
    { opponent: 'Bayern Munich', result: 'D', score: '1-1', competition: 'UCL Semi', goalsFor: 1, goalsAgainst: 1, xG: 1.3, xGA: 1.5, possession: 42 },
    { opponent: 'Monaco', result: 'W', score: '4-0', competition: 'Ligue 1', goalsFor: 4, goalsAgainst: 0, xG: 3.5, xGA: 0.3, possession: 67 },
    { opponent: 'Lille', result: 'W', score: '2-0', competition: 'Ligue 1', goalsFor: 2, goalsAgainst: 0, xG: 1.9, xGA: 0.7, possession: 60 },
    { opponent: 'Barcelona', result: 'W', score: '2-1', competition: 'UCL QF', goalsFor: 2, goalsAgainst: 1, xG: 1.7, xGA: 1.4, possession: 47 },
    { opponent: 'Barcelona', result: 'L', score: '1-3', competition: 'UCL QF', goalsFor: 1, goalsAgainst: 3, xG: 1.2, xGA: 2.5, possession: 44 },
    { opponent: 'Nice', result: 'W', score: '3-1', competition: 'Ligue 1', goalsFor: 3, goalsAgainst: 1, xG: 2.8, xGA: 0.8, possession: 63 },
    { opponent: 'Rennes', result: 'D', score: '1-1', competition: 'Ligue 1', goalsFor: 1, goalsAgainst: 1, xG: 1.5, xGA: 1.1, possession: 59 },
  ],

  // Arsenal key players with market values (€ millions) and season stats
  arsenalPlayers: [
    { name: 'Bukayo Saka', position: 'RW', value: 150, goals: 19, assists: 14, rating: 8.4 },
    { name: 'Martin Ødegaard', position: 'CAM', value: 130, goals: 12, assists: 16, rating: 8.2 },
    { name: 'Kai Havertz', position: 'ST', value: 85, goals: 16, assists: 7, rating: 7.8 },
    { name: 'Declan Rice', position: 'CM', value: 120, goals: 8, assists: 9, rating: 8.1 },
    { name: 'William Saliba', position: 'CB', value: 110, goals: 3, assists: 2, rating: 8.3 },
    { name: 'David Raya', position: 'GK', value: 50, goals: 0, assists: 0, rating: 7.9 },
    { name: 'Gabriel Jesus', position: 'ST', value: 55, goals: 11, assists: 5, rating: 7.5 },
    { name: 'Jurriën Timber', position: 'RB', value: 65, goals: 2, assists: 6, rating: 7.7 },
    { name: 'Gabriel Magalhães', position: 'CB', value: 90, goals: 5, assists: 1, rating: 8.0 },
    { name: 'Leandro Trossard', position: 'LW', value: 45, goals: 10, assists: 8, rating: 7.6 },
  ],

  // PSG key players with market values (€ millions) and season stats
  psgPlayers: [
    { name: 'Ousmane Dembélé', position: 'RW', value: 80, goals: 15, assists: 13, rating: 8.1 },
    { name: 'Bradley Barcola', position: 'LW', value: 90, goals: 18, assists: 9, rating: 8.0 },
    { name: 'Achraf Hakimi', position: 'RB', value: 65, goals: 5, assists: 11, rating: 7.9 },
    { name: 'Vitinha', position: 'CM', value: 80, goals: 9, assists: 12, rating: 8.2 },
    { name: 'Marquinhos', position: 'CB', value: 40, goals: 3, assists: 2, rating: 7.8 },
    { name: 'Gianluigi Donnarumma', position: 'GK', value: 38, goals: 0, assists: 0, rating: 7.6 },
    { name: 'Joao Neves', position: 'CM', value: 85, goals: 7, assists: 10, rating: 7.9 },
    { name: 'Gonçalo Ramos', position: 'ST', value: 65, goals: 14, assists: 5, rating: 7.7 },
    { name: 'Lucas Hernández', position: 'CB', value: 45, goals: 1, assists: 1, rating: 7.5 },
    { name: 'Warren Zaïre-Emery', position: 'CM', value: 70, goals: 6, assists: 8, rating: 7.8 },
  ],

  // Season statistics
  seasonStats: {
    arsenal: {
      played: 52, wins: 38, draws: 8, losses: 6,
      goalsFor: 98, goalsAgainst: 32,
      cleanSheets: 22, avgPossession: 55.3,
      xGFor: 92.4, xGAgainst: 35.1,
      cornersPG: 6.8, shotsPG: 16.2, shotsOnTargetPG: 6.1,
      passAccuracy: 88.2, tacklesPG: 18.5,
      leaguePosition: 1, uclPath: ['Group Winner', 'R16 1st', 'QF Winner', 'SF Winner'],
      totalSquadValue: 1150 // millions
    },
    psg: {
      played: 50, wins: 36, draws: 7, losses: 7,
      goalsFor: 102, goalsAgainst: 38,
      cleanSheets: 19, avgPossession: 58.1,
      xGFor: 96.8, xGAgainst: 40.2,
      cornersPG: 7.2, shotsPG: 17.5, shotsOnTargetPG: 6.8,
      passAccuracy: 89.5, tacklesPG: 16.8,
      leaguePosition: 1, uclPath: ['Group Winner', 'R16 1st', 'QF Winner', 'SF Winner'],
      totalSquadValue: 980 // millions
    }
  }
};
