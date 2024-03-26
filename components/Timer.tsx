import Colors from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Pressable, useColorScheme } from "react-native";
import { useTimer } from "react-use-precision-timer";

import { Audio } from 'expo-av';


export default function Timer({ initialMilliseconds = 0, callback }: { initialMilliseconds: number, callback?: () => void }) {
    const [timeLeft, setTimeLeft] = useState(initialMilliseconds);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [milliseconds, setMilliseconds] = useState(0);

    const countRef = useRef<number | null>(null);

    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const colorScheme = useColorScheme();

    const updateTime = () => {
        setTimeLeft((prev) => prev - 10);
    }
    
    const timer = useTimer({ delay: 10 }, updateTime);

    useEffect(() => {
        if (isPaused) {
            timer.pause();
        } else {
            timer.resume();
        }
    }, [isPaused]);

    useEffect(() => {
        if (isActive) {
            timer.start();
        } else {
            timer.stop();
        }
    }, [isActive]);
            
    useEffect(() => {
        const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        const milliseconds = Math.floor((timeLeft % 1000) / 10);

        setMinutes(minutes);
        setSeconds(seconds);
        setMilliseconds(milliseconds);

        if (timeLeft <= 0) {
            setTimeLeft(0);
            setIsActive(false);
            playSound();
            if (callback) {
                callback();
            }
        }
    }, [timeLeft]);

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    const handleReset = () => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(initialMilliseconds);
    };

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync( require('../assets/sounds/beep.mp3')
        );
        setSound(sound);
    
        console.log('Playing Sound');
        await sound.playAsync();
      }

    useEffect(() => {
    return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync();
        }
        : undefined;
    }, [sound]);

    return (
        <View style={[styles.container, {
            backgroundColor: colorScheme === "light" ? Colors.light.background : Colors.dark.background,
        }]}>
            <Text style={[styles.timer, {
                color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
            }]}>
                {minutes < 10 ? `0${minutes}`: minutes}:{seconds < 10 ? `0${seconds}` : seconds},{milliseconds < 10 ? `0${milliseconds}` : milliseconds}
            </Text>
            <View style={styles.buttons}>
                <Pressable
                    style={styles.button}
                    onPress={handleStart}
                >
                    <Text style={[styles.buttonText,{
                        color: Colors.primary,
                    }]}>
                        Start
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.button}
                    onPress={handlePause}
                >
                    <Text style={[styles.buttonText,{
                        color: Colors.primary,
                    }]}>
                        {isPaused ? "Resume" : "Pause"}
                    </Text>
                </Pressable>
                
                <Pressable
                    style={styles.button}
                    onPress={handleReset}
                >
                    <Text style={[styles.buttonText,{
                        color: Colors.primary,
                    }]}>
                        Reset
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    timer: {
        fontSize: 60,
    },
    buttons: {
        flexDirection: "row",
    },
    button: {
        margin: 10,
        padding: 10,
    },
    buttonText: {
        fontSize: 20,
    },

});
