const localizations = require('./locales/en.json')

export const getApiBaseUrl = () => {
  const API_URL_INTERNAL = `${process.env.NEXT_PUBLIC_API_URL}` || 'localhost:8000';
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${API_URL_INTERNAL}`;
  }

  return  `http://localhost:8000`;
};

export const getWikiLink = (page) => {
  return `https://eu4.paradoxwikis.com/${page}`
};

export const getImageUrl = (imageName) => {
  return `${getApiBaseUrl()}/images/${imageName}.png`;
};

export const getApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}${endpoint}`;
};

export const translate = (key) => {
  if (!key in localizations) {
    console.log("Warning translation absent", key)
  }
  return key in localizations ? localizations[key] : "***" + key + "***"
}

export const formatModifierValue = (name, value) => {
  const percentageModifiers = ["Colonial Range", "Samurai Force Limit", "Military Technology Cost", "Province War Score Cost", "Core-Creation Cost", "Idea Cost", "Cost of Advisors with Ruler's Religion", "Administrative Efficiency", "Trade Power Abroad", "Cavalry Cost", "National Tax Modifier", "Recruitment Time", "Dhimmi Loyalty Equilibrium", "Governing Capacity Modifier", "Trade Steering", "Trade Company Investment Cost", "Advisor Costs", "Construction Time", "Diplomatic Annexation Cost", "Spy Network Construction", "Blockade Efficiency", "Leader cost", "Missionary Strength", "Overextension Impact Modifier", "Prestige from Land battles", "Recover Navy Morale Speed", "Cost to fabricate claims", "Institution Spread", "Chance of New Heir", "Transport Cost", "Morale of Armies", "Missionary Strength vs Heretics", "Reinforce Speed", "Minimum Autonomy in Territories", "Manpower in Primary Culture provinces", "Galley Combat Ability", "The Captains Influence #????", "Ship Durability", "Global Naval Engagement Modifier", "Sailor Recovery Speed", "Light Ship Cost", "Domestic Trade Power", "States Governing Cost", "Land Attrition", "Coastal Raiding Range", "Fort Defense", "Harsh Treatment Cost", "Power Projection from Insults", "Monthly Piety Accelerator", "Production Efficiency", "Yearly Army Tradition Decay", "Institution Embracement Cost", "Artillery Damage from Back Row", "Ship Trade Power", "Native Uprising Chance", "Cost of enforcing religion through war", "Mercenary Discipline", "War Taxes Cost", "Privateer Efficiency", "Trade Range", "Gold Depletion Chance Modifier", "Embargo Efficiency", "Great Project Upgrade Time", "Trade Efficiency", "National Garrison Growth", "Great Project Upgrade Cost", "Expand Administration Cost", "Development Cost", "General Cost", "Provincial Trade Power Modifier", "Migration Cost", "State Maintenance", "National Manpower Modifier", "Flagship cost", "Heavy Ship Combat Ability", "Artillery Cost", "Regiment Costs", "Unjustified Demands", "Cavalry Combat Ability", "Improve Relations", "Fort Maintenance", "War Score Cost vs Other Religions", "Clergy Loyalty Equilibrium", "Galley Cost", "Loot Amount", "Autonomy Change Cooldown", "National Supply Limit Modifier", "Burghers Loyalty Equilibrium", "Caravan Power", "Possible Manchu Banners", "Estate Loyalty Change on Privilege revoked", "Diplomatic Technology Cost", "Center of Trade Upgrade Cost", "Recover Army Morale Speed", "Marines Force Limit", "Prestige from Naval battles", "Cost to justify trade conflict", "Land Force Limit Modifier", "Mercenary Cost", "Garrison Army Damage", "Foreign Spy Detection", "National Sailors Modifier", "Technology Cost", "Religious Unity", "Shipbuilding Time", "Shock Damage Received", "Rebel Support Efficiency", "Monthly Piety", "Land Maintenance Modifier", "Envoy Travel Time", "Church Power Modifier", "Assimilated Natives", "Vassal Force Limit Contribution", "Land Fire Damage", "Change Rival Cost", "Aggressive Expansion Impact", "Imperial Authority Growth Modifier", "Yearly Patriarch Authority", "Morale Damage", "Promote Culture Cost", "All Estates' Loyalty Equilibrium", "Income from Vassals", "Artillery Combat Ability", "Liberty Desire in Subjects", "Infantry Cost", "Cavalry to Infantry Ratio", "Missionary Maintenance Cost", "Global Trade Power", "Morale Hit When Losing a Ship", "Ship Tradepower Propagation", "Infantry Shock", "Garrison Size", "Ship Disengagement Chance", "Culture Conversion Cost", "Development Cost in Primary Culture", "Siege Ability", "Movement Speed", "Female Advisor Chance", "Nobility Influence", "Army Tradition From Battles", "Prestige Decay", "Innovativeness Gain", "Mercenary Maintenance", "Naval Force Limit Modifier", "Army Drill Gain Modifier", "Yearly Army Professionalism", "Curia Powers cost", "Construction Cost", "Chance to Capture Enemy Ships", "effect", "Fort Maintenance on border with rival", "Reinforce Cost", "Liberty Desire from Subjects Development", "Reform Progress Growth", "Cavalry Flanking Ability", "Heavy Ship Cost", "Manpower Recovery Speed", "Manpower in Accepted Culture provinces", "Cost of Advisors with Ruler's Culture", "Morale of Navies", "Shock Damage", "Mercenary Manpower", "Infantry Combat Ability", "Max effect of Absolutism", "Ship Costs", "Manpower in True Faith provinces", "Light Ship Combat Ability", "Stability Cost Modifier", "Fire Damage Received", "Burghers influence", "Discipline", "Naval Tradition From Battles", "Naval Attrition", "Cost of Reducing War Exhaustion", "Yearly Navy Tradition Decay", "Goods Produced Modifier", "Reelection Cost", "Administrative Advisor Cost", "Nobility Loyalty Equilibrium", "Administrative Technology Cost", "Global Tariffs", "Sailor Maintenance", "Marathas loyalty equilibrium", "Rajputs loyalty equilibrium", "Vaisyas loyalty equilibrium", "Tribes loyalty equilibrium", "Clergy loyalty equilibrium", "Spy Action Cost Modifier", "Qizilbash Loyalty Equilibrium", "Jains loyalty equilibrium", "Brahmins loyalty equilibrium", "Settler Chance", "Ghilman Loyalty Equilibrium", "Razing Power Gain", "Missionary Strength vs Heathens", "Appoint Cardinal cost"];
  if (typeof value != 'float' && typeof value != 'number') {
    return "";
  }
  if (percentageModifiers.includes(translate(name))) {

    if (translate(name) == "Liberty Desire in Subjects") {
      return `${value*-1}%`;
    }
    return `${value > 0 ? '+' : ''}${value * 100}%`;
  }
  return `${value > 0 ? '+' : ''}${value}`;
}