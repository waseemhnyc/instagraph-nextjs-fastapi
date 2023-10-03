
export type SavedHistory = {
  searchValue: string,
  results: {
    nodes: {}[],
    edges: {}[]
  }
}

export const defaultSavedHistory: SavedHistory[] = [
  {
    searchValue: "Quantum Physics",
    results: {
      nodes: [
        {
            "data": {
                "label": "Quantum Physics"
            },
            "deletable": false,
            "draggable": true,
            "id": "1",
            "position": {
                "x": 0,
                "y": 0
            },
            "selectable": false,
            "style": {
                "background": "#99CCFF",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Wave-Particle Duality"
            },
            "deletable": false,
            "draggable": true,
            "id": "2",
            "position": {
                "x": -200,
                "y": -150
            },
            "selectable": false,
            "style": {
                "background": "#FFCCCC",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Superposition"
            },
            "deletable": false,
            "draggable": true,
            "id": "3",
            "position": {
                "x": -200,
                "y": 150
            },
            "selectable": false,
            "style": {
                "background": "#FFCCCC",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Entanglement"
            },
            "deletable": false,
            "draggable": true,
            "id": "4",
            "position": {
                "x": 200,
                "y": -150
            },
            "selectable": false,
            "style": {
                "background": "#FFCCCC",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Quantum Mechanics"
            },
            "deletable": false,
            "draggable": true,
            "id": "5",
            "position": {
                "x": 200,
                "y": 150
            },
            "selectable": false,
            "style": {
                "background": "#FFCCCC",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Quantum Computing"
            },
            "deletable": false,
            "draggable": true,
            "id": "6",
            "position": {
                "x": 400,
                "y": 0
            },
            "selectable": false,
            "style": {
                "background": "#66FF99",
                "color": "#000000"
            }
        }
    ],
      edges: [
        {
            "id": "1-2",
            "label": "Involves",
            "source": "1",
            "style": {
                "stroke": "#CCCCFF"
            },
            "target": "2",
            "type": "default"
        },
        {
            "id": "1-3",
            "label": "Involves",
            "source": "1",
            "style": {
                "stroke": "#CCCCFF"
            },
            "target": "3",
            "type": "default"
        },
        {
            "id": "1-4",
            "label": "Involves",
            "source": "1",
            "style": {
                "stroke": "#CCCCFF"
            },
            "target": "4",
            "type": "default"
        },
        {
            "id": "1-5",
            "label": "Involves",
            "source": "1",
            "style": {
                "stroke": "#CCCCFF"
            },
            "target": "5",
            "type": "default"
        },
        {
            "id": "5-6",
            "label": "Enables",
            "source": "5",
            "style": {
                "stroke": "#9999FF"
            },
            "target": "6",
            "type": "default"
        }
    ]
    }
  },
  {
    searchValue: "Artificial Intelligence",
    results: {
      nodes: [
        {
            "data": {
                "label": "Artificial Intelligence"
            },
            "deletable": false,
            "draggable": true,
            "id": "AI",
            "position": {
                "x": 200,
                "y": 200
            },
            "selectable": false,
            "style": {
                "background": "#FFCBA4",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Machine Learning"
            },
            "deletable": false,
            "draggable": true,
            "id": "MachineLearning",
            "position": {
                "x": 100,
                "y": 100
            },
            "selectable": false,
            "style": {
                "background": "#AED6F1",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Neural Networks"
            },
            "deletable": false,
            "draggable": true,
            "id": "NeuralNetworks",
            "position": {
                "x": 100,
                "y": 300
            },
            "selectable": false,
            "style": {
                "background": "#AED6F1",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Computer Vision"
            },
            "deletable": false,
            "draggable": true,
            "id": "ComputerVision",
            "position": {
                "x": 300,
                "y": 100
            },
            "selectable": false,
            "style": {
                "background": "#AED6F1",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Natural Language Processing"
            },
            "deletable": false,
            "draggable": true,
            "id": "NaturalLanguageProcessing",
            "position": {
                "x": 300,
                "y": 300
            },
            "selectable": false,
            "style": {
                "background": "#AED6F1",
                "color": "#000000"
            }
        }
    ],
      edges: [
        {
            "id": "AI-MachineLearning",
            "label": "Incorporates",
            "source": "AI",
            "style": {
                "stroke": "#FADBD8"
            },
            "target": "MachineLearning",
            "type": "default"
        },
        {
            "id": "AI-NeuralNetworks",
            "label": "Utilizes",
            "source": "AI",
            "style": {
                "stroke": "#FADBD8"
            },
            "target": "NeuralNetworks",
            "type": "default"
        },
        {
            "id": "AI-ComputerVision",
            "label": "Applies",
            "source": "AI",
            "style": {
                "stroke": "#FADBD8"
            },
            "target": "ComputerVision",
            "type": "default"
        },
        {
            "id": "AI-NaturalLanguageProcessing",
            "label": "Applies",
            "source": "AI",
            "style": {
                "stroke": "#FADBD8"
            },
            "target": "NaturalLanguageProcessing",
            "type": "default"
        }
    ]
    }
  },
  {
    searchValue: "Space Exploration",
    results: {
      nodes: [
        {
            "data": {
                "label": "Space Exploration"
            },
            "deletable": false,
            "draggable": true,
            "id": "0",
            "position": {
                "x": 0,
                "y": 0
            },
            "selectable": false,
            "style": {
                "background": "#FF9F00"
            }
        },
        {
            "data": {
                "label": "Manned Missions"
            },
            "deletable": false,
            "draggable": true,
            "id": "1",
            "position": {
                "x": -350,
                "y": -150
            },
            "selectable": false,
            "style": {
                "background": "#FF5470"
            }
        },
        {
            "data": {
                "label": "Unmanned Missions"
            },
            "deletable": false,
            "draggable": true,
            "id": "2",
            "position": {
                "x": 350,
                "y": -150
            },
            "selectable": false,
            "style": {
                "background": "#94D82D",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Spacecraft"
            },
            "deletable": false,
            "draggable": true,
            "id": "3",
            "position": {
                "x": -350,
                "y": 150
            },
            "selectable": false,
            "style": {
                "background": "#0094FF",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Planets and Moons"
            },
            "deletable": false,
            "draggable": true,
            "id": "4",
            "position": {
                "x": 350,
                "y": 150
            },
            "selectable": false,
            "style": {
                "background": "#33D6FF",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "NASA"
            },
            "deletable": false,
            "draggable": true,
            "id": "5",
            "position": {
                "x": -700,
                "y": -320
            },
            "selectable": false,
            "style": {
                "background": "#FF0798",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "SpaceX"
            },
            "deletable": false,
            "draggable": true,
            "id": "6",
            "position": {
                "x": -700,
                "y": 320
            },
            "selectable": false,
            "style": {
                "background": "#1C5179",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Apollo Program"
            },
            "deletable": false,
            "draggable": true,
            "id": "7",
            "position": {
                "x": -450,
                "y": -250
            },
            "selectable": false,
            "style": {
                "background": "#FF5470",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Viking Program"
            },
            "deletable": false,
            "draggable": true,
            "id": "8",
            "position": {
                "x": -450,
                "y": -50
            },
            "selectable": false,
            "style": {
                "background": "#94D82D",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Mars Rover Missions"
            },
            "deletable": false,
            "draggable": true,
            "id": "9",
            "position": {
                "x": -450,
                "y": 150
            },
            "selectable": false,
            "style": {
                "background": "#94D82D",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Juno Mission"
            },
            "deletable": false,
            "draggable": true,
            "id": "10",
            "position": {
                "x": -450,
                "y": 250
            },
            "selectable": false,
            "style": {
                "background": "#94D82D",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Satellites"
            },
            "deletable": false,
            "draggable": true,
            "id": "11",
            "position": {
                "x": 700,
                "y": -150
            },
            "selectable": false,
            "style": {
                "background": "#0094FF",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "International Space Station"
            },
            "deletable": false,
            "draggable": true,
            "id": "12",
            "position": {
                "x": 900,
                "y": -150
            },
            "selectable": false,
            "style": {
                "background": "#33D6FF",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Moon Landing"
            },
            "deletable": false,
            "draggable": true,
            "id": "13",
            "position": {
                "x": -200,
                "y": -350
            },
            "selectable": false,
            "style": {
                "background": "#FF5470",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Mars Exploration"
            },
            "deletable": false,
            "draggable": true,
            "id": "14",
            "position": {
                "x": -200,
                "y": 50
            },
            "selectable": false,
            "style": {
                "background": "#94D82D",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Jupiter Flyby"
            },
            "deletable": false,
            "draggable": true,
            "id": "15",
            "position": {
                "x": -200,
                "y": 250
            },
            "selectable": false,
            "style": {
                "background": "#94D82D",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Planet Mars"
            },
            "deletable": false,
            "draggable": true,
            "id": "16",
            "position": {
                "x": 700,
                "y": 0
            },
            "selectable": false,
            "style": {
                "background": "#FF9F00",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Moon"
            },
            "deletable": false,
            "draggable": true,
            "id": "17",
            "position": {
                "x": 700,
                "y": -300
            },
            "selectable": false,
            "style": {
                "background": "#33D6FF",
                "color": "#000000"
            }
        }
    ],
      edges: [
        {
            "id": "0-1",
            "label": "consists of",
            "source": "0",
            "style": {
                "stroke": "#FF5470"
            },
            "target": "1",
            "type": "default"
        },
        {
            "id": "0-2",
            "label": "consists of",
            "source": "0",
            "style": {
                "stroke": "#94D82D"
            },
            "target": "2",
            "type": "default"
        },
        {
            "id": "0-3",
            "label": "consists of",
            "source": "0",
            "style": {
                "stroke": "#0094FF"
            },
            "target": "3",
            "type": "default"
        },
        {
            "id": "0-4",
            "label": "consists of",
            "source": "0",
            "style": {
                "stroke": "#33D6FF"
            },
            "target": "4",
            "type": "default"
        },
        {
            "id": "1-5",
            "label": "participates in",
            "source": "1",
            "style": {
                "stroke": "#FF5470"
            },
            "target": "5",
            "type": "default"
        },
        {
            "id": "1-6",
            "label": "participates in",
            "source": "1",
            "style": {
                "stroke": "#1C5179"
            },
            "target": "6",
            "type": "default"
        },
        {
            "id": "3-7",
            "label": "participates in",
            "source": "3",
            "style": {
                "stroke": "#FF5470"
            },
            "target": "7",
            "type": "default"
        },
        {
            "id": "3-8",
            "label": "participates in",
            "source": "3",
            "style": {
                "stroke": "#94D82D"
            },
            "target": "8",
            "type": "default"
        },
        {
            "id": "4-9",
            "label": "participates in",
            "source": "4",
            "style": {
                "stroke": "#94D82D"
            },
            "target": "9",
            "type": "default"
        },
        {
            "id": "4-10",
            "label": "participates in",
            "source": "4",
            "style": {
                "stroke": "#94D82D"
            },
            "target": "10",
            "type": "default"
        },
        {
            "id": "2-11",
            "label": "consists of",
            "source": "2",
            "style": {
                "stroke": "#0094FF"
            },
            "target": "11",
            "type": "default"
        },
        {
            "id": "2-12",
            "label": "participates in",
            "source": "2",
            "style": {
                "stroke": "#33D6FF"
            },
            "target": "12",
            "type": "default"
        },
        {
            "id": "4-17",
            "label": "located on",
            "source": "4",
            "style": {
                "stroke": "#33D6FF"
            },
            "target": "17",
            "type": "default"
        },
        {
            "id": "16-14",
            "label": "explored by",
            "source": "16",
            "style": {
                "stroke": "#94D82D"
            },
            "target": "14",
            "type": "default"
        },
        {
            "id": "17-13",
            "label": "landed on",
            "source": "17",
            "style": {
                "stroke": "#FF5470"
            },
            "target": "13",
            "type": "default"
        },
        {
            "id": "14-16",
            "label": "located on",
            "source": "14",
            "style": {
                "stroke": "#0094FF"
            },
            "target": "16",
            "type": "default"
        },
        {
            "id": "15-16",
            "label": "flyby of",
            "source": "15",
            "style": {
                "stroke": "#94D82D"
            },
            "target": "16",
            "type": "default"
        }
    ]
    }
  },
  {
    searchValue: "Global Economy",
    results: {
      nodes: [
        {
            "data": {
                "label": "Global Economy"
            },
            "deletable": false,
            "draggable": true,
            "id": "global_economy",
            "position": {
                "x": 0,
                "y": 0
            },
            "selectable": false,
            "style": {
                "background": "#FFC09F",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Economic Systems"
            },
            "deletable": false,
            "draggable": true,
            "id": "economic_systems",
            "position": {
                "x": -250,
                "y": 150
            },
            "selectable": false,
            "style": {
                "background": "#FFDAB9",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Market Economy"
            },
            "deletable": false,
            "draggable": true,
            "id": "market_economy",
            "position": {
                "x": -50,
                "y": 250
            },
            "selectable": false,
            "style": {
                "background": "#FFDAB9",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Command Economy"
            },
            "deletable": false,
            "draggable": true,
            "id": "command_economy",
            "position": {
                "x": -50,
                "y": 50
            },
            "selectable": false,
            "style": {
                "background": "#FFDAB9",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Mixed Economy"
            },
            "deletable": false,
            "draggable": true,
            "id": "mixed_economy",
            "position": {
                "x": 150,
                "y": -150
            },
            "selectable": false,
            "style": {
                "background": "#FFDAB9",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Economic Indicators"
            },
            "deletable": false,
            "draggable": true,
            "id": "economic_indicators",
            "position": {
                "x": 350,
                "y": -150
            },
            "selectable": false,
            "style": {
                "background": "#FFDAB9",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Gross Domestic Product (GDP)"
            },
            "deletable": false,
            "draggable": true,
            "id": "gdp",
            "position": {
                "x": 550,
                "y": -150
            },
            "selectable": false,
            "style": {
                "background": "#FFDAB9",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Inflation"
            },
            "deletable": false,
            "draggable": true,
            "id": "inflation",
            "position": {
                "x": 550,
                "y": -50
            },
            "selectable": false,
            "style": {
                "background": "#FFDAB9",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Unemployment"
            },
            "deletable": false,
            "draggable": true,
            "id": "unemployment",
            "position": {
                "x": 550,
                "y": 50
            },
            "selectable": false,
            "style": {
                "background": "#FFDAB9",
                "color": "#000000"
            }
        },
        {
            "data": {
                "label": "Exchange Rates"
            },
            "deletable": false,
            "draggable": true,
            "id": "exchange_rates",
            "position": {
                "x": 550,
                "y": 150
            },
            "selectable": false,
            "style": {
                "background": "#FFDAB9",
                "color": "#000000"
            }
        }
    ],
      edges: [
        {
            "id": "global_economy-economic_systems",
            "label": "consist of",
            "source": "global_economy",
            "style": {
                "stroke": "#AED6F1"
            },
            "target": "economic_systems",
            "type": "default"
        },
        {
            "id": "economic_systems-market_economy",
            "label": "part of",
            "source": "economic_systems",
            "style": {
                "stroke": "#AED6F1"
            },
            "target": "market_economy",
            "type": "default"
        },
        {
            "id": "economic_systems-command_economy",
            "label": "part of",
            "source": "economic_systems",
            "style": {
                "stroke": "#AED6F1"
            },
            "target": "command_economy",
            "type": "default"
        },
        {
            "id": "economic_systems-mixed_economy",
            "label": "part of",
            "source": "economic_systems",
            "style": {
                "stroke": "#AED6F1"
            },
            "target": "mixed_economy",
            "type": "default"
        },
        {
            "id": "global_economy-economic_indicators",
            "label": "measured by",
            "source": "global_economy",
            "style": {
                "stroke": "#AED6F1"
            },
            "target": "economic_indicators",
            "type": "default"
        },
        {
            "id": "economic_indicators-gdp",
            "label": "indicator of",
            "source": "economic_indicators",
            "style": {
                "stroke": "#AED6F1"
            },
            "target": "gdp",
            "type": "default"
        },
        {
            "id": "economic_indicators-inflation",
            "label": "indicator of",
            "source": "economic_indicators",
            "style": {
                "stroke": "#AED6F1"
            },
            "target": "inflation",
            "type": "default"
        },
        {
            "id": "economic_indicators-unemployment",
            "label": "indicator of",
            "source": "economic_indicators",
            "style": {
                "stroke": "#AED6F1"
            },
            "target": "unemployment",
            "type": "default"
        },
        {
            "id": "economic_indicators-exchange_rates",
            "label": "indicator of",
            "source": "economic_indicators",
            "style": {
                "stroke": "#AED6F1"
            },
            "target": "exchange_rates",
            "type": "default"
        }
    ]
    }
  }
]
