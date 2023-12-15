export default function howYaDoing(){
    var responses = [
        "I'm doing well!",
        "I'm fine",
        "good! thank you!",
        "It's a wonderful day!",
        "Jolly!"
    ];
    return responses[Math.floor(Math.random()*responses.length)]
}

// module.exports = { howYaDoing };