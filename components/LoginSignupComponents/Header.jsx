import { Image, StyleSheet, View } from 'react-native'

const Header = () => {
    return (
        <View style={styles.header}>
            <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: 150, height: 150 }}
            />
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
    },
})