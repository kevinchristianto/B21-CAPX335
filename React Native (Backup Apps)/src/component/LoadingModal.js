import React from 'react'
import {
    View,
} from 'react-native'
import Modal from 'react-native-modal'
import LottieView from 'lottie-react-native'

const HEIGHT = Platform.OS == 'ios' ? Dimensions.get('window').height : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

export default class LoadingModal extends React.PureComponent {
    render() {
        return (
            <Modal isVisible={this.props.show} useNativeDriver={true} animationIn='zoomIn' animationOut='zoomOut' deviceHeight={HEIGHT} backdropOpacity={0.3}>
                <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: 150, width: 150, backgroundColor: 'white', borderRadius: 24, overflow: 'hidden'}}>
                    {/* <ActivityIndicator size='large' color='#666' /> */}
                    <LottieView source={this.props.type == "fetching" ? require('../../assets/lottie/fetching.json') : require('../../assets/lottie/predicting.json')} autoPlay loop style={{width: 150, height: 150}} />
                </View>
            </Modal>
        )
    }
}