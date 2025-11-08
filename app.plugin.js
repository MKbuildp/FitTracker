const { withAndroidManifest, withAppBuildGradle } = require('expo/config-plugins');

/**
 * Expo Config Plugin pro Android Health Connect
 * Přidává potřebné závislosti a oprávnění
 */
const withHealthConnect = (config) => {
  // Přidání oprávnění do AndroidManifest
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }

    // Přidání oprávnění pro Health Connect
    const permissions = [
      'android.permission.health.READ_STEPS',
      'android.permission.health.WRITE_STEPS',
    ];

    permissions.forEach((permission) => {
      if (!manifest['uses-permission'].find((p) => p.$['android:name'] === permission)) {
        manifest['uses-permission'].push({
          $: { 'android:name': permission },
        });
      }
    });

    // Přidání Health Connect provider queries (musí být na úrovni manifest, ne application)
    if (!manifest.queries) {
      manifest.queries = [{}];
    }
    const queries = manifest.queries[0];
    if (!queries.package) {
      queries.package = [];
    }
    
    // Health Connect package query
    if (!queries.package.find((p) => p.$['android:name'] === 'com.google.android.apps.healthdata')) {
      queries.package.push({
        $: { 'android:name': 'com.google.android.apps.healthdata' },
      });
    }

    return config;
  });

  // Přidání Health Connect SDK do build.gradle
  // Poznámka: minSdkVersion je nastaveno přes expo-build-properties plugin
  config = withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;
    
    // Přidání závislosti Health Connect SDK
    if (!buildGradle.includes('androidx.health.connect:connect-client')) {
      // Hledáme dependencies blok
      const dependenciesMatch = buildGradle.match(/dependencies\s*\{/);
      if (dependenciesMatch) {
        // Najdeme konec dependencies bloku pomocí počítání závorek
        let braceCount = 1;
        let dependenciesStart = dependenciesMatch.index + dependenciesMatch[0].length;
        let dependenciesEnd = -1;
        
        for (let i = dependenciesStart; i < buildGradle.length; i++) {
          if (buildGradle[i] === '{') braceCount++;
          if (buildGradle[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              dependenciesEnd = i;
              break;
            }
          }
        }
        
        if (dependenciesEnd > 0) {
          // Najdeme poslední řádek před uzavírací závorkou
          let lastNewline = dependenciesEnd;
          for (let i = dependenciesEnd - 1; i >= dependenciesStart; i--) {
            if (buildGradle[i] === '\n') {
              lastNewline = i;
              break;
            }
          }
          
          const healthConnectDependency = '    implementation "androidx.health.connect:connect-client:1.1.0-alpha07"\n';
          buildGradle = 
            buildGradle.slice(0, lastNewline + 1) + 
            healthConnectDependency + 
            buildGradle.slice(lastNewline + 1);
        }
      }
    }
    
    config.modResults.contents = buildGradle;
    return config;
  });

  return config;
};

module.exports = withHealthConnect;

