# Spelmotor

För det här projektet kommer vi att utgå från denna spelmotor. Koden grundar sig på material från [Franks laboratory](https://www.youtube.com/@Frankslaboratory). Han har skapat mycket material där JS används för att skapa spel. I hans grund får vi en bra start och ide om hur vi kan jobba med klasser och objekt i JS.

I det här som är ditt startrepo (du kan jobba i det eller göra ett nytt, där du följer installationsinstruktionerna nedan) så ska vi gå igenom hur det fungerar.
Strukturen på repot är ett antal branches och readme filer där koden förklaras.

## Branches
- [main](https://github.com/jensadev/te22-spelmotor/) Grunderna och strukturen
- [player input](https://github.com/jensadev/te22-spelmotor/tree/player-input) Styr spelaren, lyssna på tangentbordet
- [player sprite](https://github.com/jensadev/te22-spelmotor/tree/player-sprite) Använda en sprite för spelaren och animera den
- [background image](https://github.com/jensadev/te22-spelmotor/tree/background-image) Lägga till en bakgrundsbild skapad av flera lager

## Mål

Målet med projektet är att skapa ett spel och förstå Javascript tillräckligt för att kunna göra det. Vi kommer att använda oss av klasser och objekt för att skapa spelet. Vi kommer att använda canvas för att rita spelet.

## Setup
## Bakgrundsbilder

De flesta spel använder någon form av bakgrundsbild. Det kan vara en enkel färg, en bild eller en animation. Hittills har vi använt en enkel färg som bakgrund. Nu ska vi lära oss att använda en bild som bakgrund.

Bilder som bakgrunder ger oss också möjlighet att skapa illusioner av rörelse och djup. Vi kan till exempel skapa en bild av en väg som rör sig från höger till vänster och använda den som bakgrund. Det ger oss en illusion av att bilen rör sig framåt. Vi kan också skapa bilder i flera lager som rör sig i olika hastigheter för att skapa en illusion av djup.

### Ladda en bakgrund

För att förbereda oss för att kunna skapa flera lager i bakgrunden så kommer vi att dela upp det i två klasser, bakgrund och lager.

Vi kommer att skapa `Background.js` klassen för att ladda in bilderna och från den skapa varje enskilt lager. Det är lagret som sedan används för att uppdatera och rita ut bilden.

`src/Background.js`
```javascript
export default class Background {
  constructor(game) {
    this.game = game
    this.width = 1708 // this.game.width * 2
    this.height = 480 // this.game.height

    this.backgroundLayers = [
    ]
  }

  update(deltaTime) {
    this.backgroundLayers.forEach(layer => {
      layer.update(deltaTime)
    })
  }

  draw(ctx) {
    this.backgroundLayers.forEach(layer => {
      layer.draw(ctx)
    })
  }

}
```

Varje lager i `Background` klassen kommer att skapas med `Layer` klassen. `Layer` klassen kommer att innehålla information om bredd, höjd, hastighet och bild för varje lager.

`src/Layer.js`
```javascript
export default class Layer {
  constructor(game, width, height, speed, image) {
    this.game = game
    this.width = width
    this.height = height
    this.speed = speed
    this.image = image
    this.x = 0
    this.y = 0
  }

  update(deltaTime) {
    if (this.x <= -this.width) {
      this.x = 0
    }
    this.x -= this.game.speed * this.speed
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
  }
}
```

### Förklaring

- `Background` klassen innehåller en array `backgroundLayers` som innehåller alla lager.

- `Layer` klassen innehåller information om bredd, höjd, hastighet och bild för varje lager.

- `update` funktionen uppdaterar positionen för varje lager.

- `draw` funktionen ritar ut lagret. Vi ritar ut bilden två gånger med en offset på bredden för att skapa en illusion av en oändlig bakgrund.

### Använda bakgrundsbilder

För att använda bakgrundsbilderna vi skapat så behöver vi slutligen uppdatera `Game` klassen. Vi sätter `speed` parametern för att kunna styra hastigheten på bakgrundsbilderna.

`src/Game.js`
```javascript
import Background from './Background.js'

export default class Game {
  constructor() {
    ...
    this.background = new Background(this)
    this.speed = 1
    ...
  }

  update(deltaTime) {
    this.background.update(deltaTime)
    ...
  }

  draw(ctx) {
    this.background.draw(ctx)
    ...
  }
}
```

Testkör spelet och se att bakgrundsbilderna rör sig från höger till vänster.
Vi kan nu sätta spelarens position till marklagret, för att ge en illusion av att spelaren rör sig på marken.

I Player.js så sätt `super(game, 0, 300, 128, 128, "#fff", 5)` för att sätta spelarens position till marklagret.
När du nu kör spelet igen så kommer du se att spelaren ritas framför bakgrundsbilderna. Det är för att vi uppdaterar alla lager i bakgrunden innan vi ritar ut spelaren. Men vi kan inte rita ut spelaren innan vi ritar ut bakgrundsbilderna, för då kommer spelaren att ritas över bakgrundsbilderna.

Lösningen är att manuellt rita ut det lager som är framför spelaren, efter spelaren i `Game` klassens `draw` funktion.

`src/Game.js`
```javascript
  draw(ctx) {
    this.background.draw(ctx)
    this.gameObjects.forEach(gameObject => {
      gameObject.draw(ctx)
    })

    this.player.draw(ctx)
    this.background.backgroundLayers[3].draw(ctx)
  }
```

<<<<<<< HEAD
Om du nu öppnar sidan i webbläsaren så ska du se tre färger som rör sig över canvasen och studsar när de når kanten.

#### Utmaning

Skapa och studsa spelobjekt på y-axeln.

## Refaktorisera spelobjeket och Game

Vi kan nu refaktorisera `GameObject` och `Game` för att göra koden mer läsbar och enklare att förstå. Vi har nuläget all logik för att uppdatera gameobjekt i `Game`. Vi kan flytta logiken till `GameObject` för att göra koden mer läsbar.

### Uppdatera GameObject

Öppna `GameObject.js` och lägg till följande kod.

```javascript
  constructor(game, x, y, width, height, color, maxSpeed) {
    this.game = game
    ...
    this.currentSpeed = 0
    this.maxSpeed = maxSpeed
    this.direction = 1
  }

  update(deltaTime) {
    this.x = this.x + this.maxSpeed / 1000 * deltaTime * this.direction
    if (this.x > this.game.width - this.width) this.direction = -1
    if (this.x < 0) this.direction = 1
  }
```

Vi har nu flyttat logiken för att uppdatera spelobjekt till `GameObject`. Vi skickar med `game` för att kunna använda `width` i `update`. Vi har också lagt till `currentSpeed` för att kunna använda `speed` i `update`.

### Uppdatera Game

Öppna `Game.js` och lägg till följande kod.

```javascript
this.gameObjects = [
  new GameObject(this, 0, 100, 20, 20, '#f00', 100),
  new GameObject(this, 0, 200, 20, 20, '#0f0', 200),
  new GameObject(this, 0, 300, 20, 20, '#00f', 300)
]

update(deltaTime) {
  this.gameObjects.forEach(gameObject => {
    gameObject.update(deltaTime)
  })
}
```

Vi har nu flyttat logiken för att uppdatera spelobjekt till `GameObject`. Vi skickar med `this` för att kunna använda `width` i `update`.

Om du nu öppnar sidan i webbläsaren så ska du se tre färger som rör sig över canvasen och studsar när de når kanten.

En signifikant förbättring från tidigare kod och mycket tydligare och renare att läsa. `update` metoden liknar nu också mer `draw` metoden.


## Sammanfattning

Vi har nu skapat grunden för ett spel med canvas. Vi har skapat en klass `Game` som hanterar spelet och en klass för att hantera spelobjekt. Vi har använt `requestAnimationFrame` för att uppdatera och rita spelet. Vi har också använt en klass för att kunna skapa flera spelobjekt som rör sig över canvasen.

### Fundera

- Hur skulle du kunna använda `GameObject` för att skapa olika typer av spelobjekt?
- Vad är de viktiga parametrarna för att skapa ett spelobjekt? Vad krävs?

### Utmaning

Skapa en klass för att hantera spelobjekt som rör sig slumpmässigt över canvasen. Du kan använda dig av `Math.random()` för att skapa slumpmässiga värden för `x` och `y`.

### Nästa steg
=======
Nu kommer spelaren att ritas framför bakgrundsbilderna.
>>>>>>> endless-runner

### Uppgift

Nu kan du skapa en klassisk sidescroller, testa att ändra spelarens position och bakgrundsbildernas hastighet för att skapa olika illusioner.