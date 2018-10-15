var sizeGame = 0;
var strikeOff = 0;
var sizeMaxGameBoard = 600;
var shout = 0;
var win = 0;

var infoAboutMove;

function isEnd() {
    for (var i = 0; i < sizeGame; i++) {
        for (var j = 0; j < sizeGame; j++) {
            if (infoAboutMove[i][j] == 0) {
                shout++;
                return true;
            }
        }
    }

    shout++;
    return false;
}

function isWin(player) {

    // poziome zwyciestwo
    var e = 0;
    var strikeOffCopy = strikeOff;
    var count = 0;
    var k = 0;

    while (e < sizeGame * sizeGame) {
        for (var i = k; i < strikeOffCopy + k; i++) {
            for (var j = e % sizeGame; j < strikeOffCopy + e % sizeGame; j++) 
            {
                if (i < sizeGame && j < sizeGame) {
                    if (infoAboutMove[i][j] == player)
                        count++;
                }
            }
            if (count == strikeOffCopy) {
                return 1;
            }
            count = 0;
        }
        e++;
        if (e % sizeGame == 0)
            k++;
    }

    // pionowo zwyciestwo
    e = 0;
    strikeOffCopy = strikeOff;
    count = 0;
    k = 0;
    while (e < sizeGame * sizeGame) {
        for (var i = k; i < strikeOffCopy + k; i++) {
            for (var j = e % sizeGame; j < strikeOffCopy + e % sizeGame; j++)
            {
                if (i < sizeGame && j < sizeGame) {
                    if (infoAboutMove[j][i] == player) {
                        count++;
                    }
                }
            }
            if (count == strikeOffCopy) {
                return 1;
            }
            count = 0;
        }
        e++;

        if (e % sizeGame == 0)
            k++;
    }


    //skosnie lewa gora -> prawy dol
    strikeOffCopy = strikeOff;
    count = 0;
    var count2 = 0;
    k = 0;

    while (k < sizeGame) {
        for (var i = 0; i < sizeGame; i++) {

            if ((i + k) < sizeGame)
            {
                if (infoAboutMove[i][i + k] == player)
                    count++;

                if (infoAboutMove[i + k][i] == player)
                    count2++;
            }
        }
        k++;
        if (count == strikeOffCopy || count2 == strikeOffCopy) {
            return 1;
        }
        count = 0;
        count2 = 0;
    }


    // prawa gora - lewy dol
    var strikeOffCopy = strikeOff;
    count = 0;
    count2 = 0;
    var it=1;

    for (var i = 0; i < sizeGame; i++) {
        for (var j = sizeGame-i-1; j>=0; j--) {

            if (infoAboutMove[i+j][sizeGame-1-j] == player) 
                count++;

            if (infoAboutMove[j][sizeGame - j - it] == player)
                count2++;

        }
        it++;

        if (count == strikeOffCopy || count2 == strikeOffCopy) {
            return 1;
        }
        count=0;
        count2=0;
    }

    return 0;
}


function move(x, y) {

    // sprawdz czy gracz moze zrobic ruch
    if (infoAboutMove[x][y] <= 0) {

        //ruch gracza
        if (isEnd()) {
            infoAboutMove[x][y] = 1;
            var numberChild = x * sizeGame + y;
            document.getElementsByClassName("flexChildGameBoard")[numberChild].innerHTML = '<i class="far fa-circle"></i>';

            //sprawdz czy wygral
            var win = isWin(1);
            if (win == 1) {
                console.log("gracz wygrał!");
            }
        }

        // ruch komputera
        if (isEnd()) {
            var searchEmpty = true;
            while (searchEmpty) {
                var x = Math.floor(Math.random() * sizeGame);
                var y = Math.floor(Math.random() * sizeGame);

                if (infoAboutMove[x][y] <= 0) {

                    searchEmpty = false;
                    infoAboutMove[x][y] = 2;
                    var numberChild = x * sizeGame + y;
                    document.getElementsByClassName("flexChildGameBoard")[numberChild].innerHTML = '<i class="fas fa-times"></i>';
                    //sprawdz czy wygral
                    ////////////////////
                }
            }
        }

        // ostateczne stwierdznie, jesli wczesniej nie bylo wyniku
        if (shout >= sizeGame * sizeGame) {
            console.log("remis");
        }

    }
    else {
        console.log("zajete - " + infoAboutMove[x][y]);
    }
}

$(document).ready(function () {

    $("#formGenerateGame").submit(function (event) {

        sizeGame = $('input[name="sizeGame"]').val();
        strikeOff = $('input[name="strikeOff"]').val();

        sizeGame = parseInt(sizeGame);
        strikeOff = parseInt(strikeOff);
        shout = 0;

        if (strikeOff > sizeGame) {
            $("#error").show();
            sizeGame = $('input[name="sizeGame"]').val('');
            strikOff = $('input[name="strikeOff"]').val('');
            event.preventDefault();
        }
        else {
            $("#error").hide();
            $("#infoFromGameForm").show();
            var output = "<p>Rozmiar planszy: " + sizeGame + "x" + sizeGame + ". Gra do " + strikeOff + " skreśleń.</p>";
            $("#infoFromGameForm").html(output);
            event.preventDefault();

            var output = "";

            //rysuj plansz i zrob siatke (macierzowa) dla wybranych puktow
            //ustaw wspolrzedne kwadratu
            var row = 0;
            var column = 0;
            for (var i = 0; i < sizeGame * sizeGame; i++) {

                output = output + '<div class="flexChildGameBoard" onclick="move(' + row + ',' + column + ')"></div>';
                if (column == sizeGame - 1) {
                    row++;
                    column = 0;
                }
                else {
                    column++;
                }
            }
            $("#boardGame").html(output);

            //stworz plansze gry
            infoAboutMove = new Array(sizeGame)
            for (var i = 0; i < sizeGame; i++) {
                infoAboutMove[i] = new Array(sizeGame)
                for (var j = 0; j < sizeGame; j++) {
                    infoAboutMove[i][j] = 0;
                }
            }

            //responsywne kwadraty siatki
            var setWidth = (sizeMaxGameBoard / sizeGame) - 2;
            var setHeight = (sizeMaxGameBoard / sizeGame) - 2;
            var setLineHeight = (sizeMaxGameBoard / sizeGame) - 2;
            var setFontSize = (sizeMaxGameBoard / sizeGame) / 2;

            for (var i = 0; i < sizeGame * sizeGame; i++) {
                document.getElementsByClassName("flexChildGameBoard")[i].style.width = setWidth + "px";
                document.getElementsByClassName("flexChildGameBoard")[i].style.height = setHeight + "px";
                document.getElementsByClassName("flexChildGameBoard")[i].style.fontSize = setFontSize + "px";
                document.getElementsByClassName("flexChildGameBoard")[i].style.lineHeight = setLineHeight + "px";
            }
        }
    });
});
