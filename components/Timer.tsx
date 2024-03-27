import Colors from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Pressable, useColorScheme } from "react-native";
import { useTimer } from "react-use-precision-timer";

import { Audio } from 'expo-av';

const UPDATE_INTERVAL = 50;

export default function Timer({ initialMilliseconds = 0, callback }: { initialMilliseconds: number, callback?: () => void }) {
    const [timeLeft, setTimeLeft] = useState(initialMilliseconds);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [milliseconds, setMilliseconds] = useState(0);

    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const colorScheme = useColorScheme();

    useEffect(() => {
        setTimeLeft(initialMilliseconds);
    }
    , [initialMilliseconds]);

    const updateTime = () => {
        setTimeLeft((prev) => prev - UPDATE_INTERVAL);
    }
    
    const timer = useTimer({ delay: UPDATE_INTERVAL }, updateTime);

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
            if (isActive) {
                setIsActive(false);
                playSound();
                if (callback) {
                    callback();
                }
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
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync(require('../assets/sounds/beep_beep.mp3'), { shouldPlay: true });
            await soundObject.setPositionAsync(0);
            await soundObject.playAsync();
            // await soundObject.unloadAsync();
            console.log('Sound played');
        
          // Your sound is playing!
        } catch (error) {
          console.log('Error playing sound:', error);
        }
      }

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                // sound.unloadAsync();
            }
            : undefined;
        }, [sound]);

    return (
        <View style={[styles.container, {
            backgroundColor: colorScheme === "light" ? Colors.light.background : Colors.dark.background,
        }]}>
            <View style={styles.timeContainer}>
                <Text style={[styles.timeChunk, {
                    color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
                }]}>
                    {minutes < 10 ? `0${minutes}`: minutes}
                </Text>

                <Text style={[styles.timeSep, {
                    color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
                }]}>
                    :
                </Text>

                <Text style={[styles.timeChunk, {
                    color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
                }]}>
                    {seconds < 10 ? `0${seconds}` : seconds}
                </Text>

                <Text style={[styles.timeSep, {
                    color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
                }]}>
                    ,
                </Text>

                <Text style={[styles.timeChunk, {
                    color: colorScheme === "light" ? Colors.light.text : Colors.dark.text,
                }]}>
                    {milliseconds < 10 ? `0${milliseconds}` : milliseconds}
                </Text>
            </View>


            <View style={styles.buttons}>

                {/* Start Button */}
                {!isActive && (
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
                )}

                {/* Pause/Resume Button */}
                {isActive && (
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
                )}

                {/* Reset Button */}
                {(isActive || (timeLeft === 0)) && (
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
                )}

                {/* Skip Button */}
                {timeLeft > 0 && (
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            setIsActive(false);
                            setTimeLeft(0);
                            if (callback) {
                                callback();
                            }
                        }}
                    >
                        <Text style={[styles.buttonText,{
                            color: Colors.primary,
                        }]}>
                            Skip
                        </Text>
                    </Pressable>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    timeChunk: {
        fontSize: 60,
        width: 75,
        textAlign: "center",
    },
    timeSep: {
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
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

});
