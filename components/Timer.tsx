import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Timer({ initialTime }: { initialTime: number }) {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const countRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive && !isPaused) {
            countRef.current = window.setInterval(() => {
                setTime((time) => time + 1);
            }, 1000);
        } else {
            clearInterval(countRef.current!);
        }
        return () => clearInterval(countRef.current!);
    }, [isActive, isPaused]);

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    const handleReset = () => {
        clearInterval(countRef.current!);
        setIsActive(false);
        setIsPaused(false);
        setTime(initialTime);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{time}</Text>
            <View style={styles.buttons}>
                <View style={styles.button}>
                    {isActive ? (
                        <Text style={styles.buttonText} onPress={handlePause}>
                            Pause
                        </Text>
                    ) : (
                        <Text style={styles.buttonText} onPress={handleStart}>
                            Start
                        </Text>
                    )}
                </View>
                <View style={styles.button}>
                    <Text style={styles.buttonText} onPress={handleReset}>
                        Reset
                    </Text>
                </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        backgroundColor: "#f0f0f0",
    },
    buttonText: {
        fontSize: 20,
    },
});
