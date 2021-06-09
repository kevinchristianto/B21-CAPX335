import React from 'react'
import {
	StyleSheet,
	Dimensions,
	Image,
	ScrollView
} from 'react-native'
import {
	View,
	Text,
	Title,
	NavigationBar,
	Button,
	Caption,
} from '@shoutem/ui'
import Icon from 'react-native-vector-icons/Feather'
import BottomSheet from 'reanimated-bottom-sheet'
import Modal from 'react-native-modal'
import {Camera} from 'expo-camera'
import LottieView from 'lottie-react-native'
import * as tf from '@tensorflow/tfjs'
import {
	bundleResourceIO,
	decodeJpeg
} from '@tensorflow/tfjs-react-native'
import { FileSystem } from 'react-native-unimodules'

import LoadingModal from './src/component/LoadingModal'

const 	WIDTH = Dimensions.get('window').width,
		HEIGHT = Platform.OS == 'ios' ? Dimensions.get('window').height : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

export default class MainScreen extends React.PureComponent {
	constructor(props) {
		super(props)
		
		this.state = {
			tfReady: false,
			showCamera: false,
			isLoading: false,
			hasCameraPermission: false,
			isLoadingModel: false
		}
		
		this.sheet = React.createRef()
		this.model = null
	}
	
	componentDidMount() {
		this.checkCameraPermission()
		this.checkTf()
	}
	
	checkCameraPermission = async () => {
		const { status } = await Camera.requestPermissionsAsync()
		this.setState({hasCameraPermission: status === 'granted'})
	}
	
	checkTf = async () => {
		this.setState({isLoadingModel: true}, async () => {
			await tf.setBackend('cpu')
			await tf.ready()
			this.setState({tfReady: true}, () => this.loadModel())
		})
	}
	
	loadModel = async () => {
		const modelJson = require('./assets/model/model.json')
		const modelWeight = require('./assets/model/group1-shard1of1.bin')
		this.model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight))
		console.log('model loaded')
		
		this.setState({
			isLoadingModel: false,
		})
	}
	
	predict = async uri => {
		const fileUri = uri
		const imgB64 = await FileSystem.readAsStringAsync(fileUri, {
			encoding: FileSystem.EncodingType.Base64,
		})
		const imageBuffer = tf.util.encodeString(imgB64, 'base64').buffer
		const raw = new Uint8Array(imageBuffer)
		const imageTensor = decodeJpeg(raw)
		const imageResized = await tf.image.resizeBilinear(imageTensor, [224, 224])
		const image = await imageResized.reshape([1, 224, 224, 3,])
		
		const prediction = await this.model.predict(image)
		// // alert(CLASSES[tf.argMax(prediction, 1).dataSync()[0]])
		alert(prediction)
		console.log(CLASSES[tf.argMax(prediction, 1).dataSync()[0]])
	}
	
	render() {
		return (
			<>
				<LoadingModal show={this.state.isLoading} />
				<View style={{flex: 1}}>
					<CameraModal
						showCamera={this.state.showCamera}
						hideSelf={() => this.setState({showCamera: false})}
						showSheet={() => this.sheet.current.snapTo(1)}
						setLoading={state => this.setState({isLoading: state})}
						model={this.model}
						predict={uri => this.predict(uri)}
					/>
					<NavigationBar
						styleName="inline clear"
						centerComponent={
							<Text styleName="h-center" style={s.title}>RICE DISEASE PREDICTION</Text>
						}
						rightComponent={
							<Button>
								<Icon
									name='help-circle'
									size={24}
									color='#666'
									style={{marginHorizontal: 8}}
								/>
							</Button>
						}
					/>
					<View styleName="vertical h-center v-center" style={s.mainContainer}>
						{this.state.isLoadingModel == true ? (
							<>
								<LottieView
									source={require('./assets/lottie/waiting-for-model.json')}
									autoPlay
									style={s.loadingAnimation}
								/>
								<Title style={{fontFamily: 'Product Sans', opacity: .6}}>Loading model...</Title>
							</>
						) : (
							<>
								<Image
									source={require('./assets/images/flowers.png')}
									style={s.image}
								/>
								<Title style={{fontSize: 24, opacity: .8, fontFamily: 'Product Sans Bold'}}>Welcome!</Title>
								<Text style={{fontSize: 16, margin: 4}}>Press button below to take a picture of rice leaf</Text>
								<Button style={{backgroundColor: '#3490dc', borderRadius: 4, paddingHorizontal: 12, margin: 16}} onPress={() => this.setState({showCamera: true})}>
									<Text style={{color: '#fff', marginHorizontal: 12, fontSize: 14}}>SCAN</Text>
								</Button>
							</>
						)}
					</View>
					
				</View>
					
				<BottomSheet
					ref={this.sheet}
					renderContent={() => <BottomSheetComponent />}
					// borderRadius={24}
					initialSnap={2}
					snapPoints={['100%', 400, 0]}
				/>
			</>
		)
	}
}
			
class CameraModal extends React.PureComponent {
	constructor(props) {
		super(props)
		
		this.state = {
			btnDisabled: false,
			showCamera: false,
			showHint: false,
		}
	}
	
	takePicture = async () => {
		if (this.camera) {
			this.setState({
				btnDisabled: true,
				showHint: true
			})
			const options = {quality: .5}
			const data = await this.camera.takePictureAsync(options)
			this.camera.pausePreview()
			this.props.setLoading(true)
			await this.props.predict(data.uri)
		}
		this.props.showSheet()
		this.props.setLoading(false)
		this.setState({
			btnDisabled: false,
			showHint: false
		})
		this.props.hideSelf()
	}
	
	render() {
		return (
			<Modal
				isVisible={this.props.showCamera}
				useNativeDriver
				animationIn='fadeInUp'
				animationOut='fadeOutUp'
				deviceHeight={HEIGHT}
				backdropOpacity={.6}
				onBackdropPress={() => this.props.hideSelf()}
				onBackButtonPress={() => this.props.hideSelf()}
				onModalShow={() => this.setState({showCamera: true})}
				onModalWillShow={() => this.setState({showCamera: false})}
			>
				<View style={s.modal}>
					{this.state.showCamera ? (
						<Camera
							ref={ref => this.camera = ref}
							style={s.camera}
							ratio="4:3"
							styleName="vertical h-center v-center"
						>
							{this.state.showHint ? (
								<Text style={s.hint}>Hold steady...</Text>
							) : null}
						</Camera>
					) : null}
				</View>
				<View styleName="horizontal h-center">
					<Button style={s.captureBtn} onPress={() => this.takePicture()} disabled={this.state.btnDisabled}>
						<Icon name='aperture' color='#666' size={40} />
					</Button>
				</View>
			</Modal>
		)
	}
}
						
class BottomSheetComponent extends React.PureComponent {
	render() {
		return (
			<ScrollView style={{minHeight: HEIGHT, backgroundColor: '#fff', padding: 24, paddingTop: 0, borderWidth: .4, borderColor: 'rgba(0, 0, 0, .2)', borderRadius: 20, overflow: 'hidden'}}>
				<View style={s.dragIndicator} />
				<View>
					{/* <Title style={[s.title, {alignSelf: 'center', textAlign: 'center'}]}>Disease Detail</Title> */}
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<LottieView
							source={require('./assets/lottie/bacteria.json')}
							autoPlay
							style={{width: 100, alignItems: 'center', justifyContent: 'center'}}
						/>
						<View>
							<Title style={{opacity: .8, fontFamily: 'Product Sans Bold'}}>Bacterial Blight</Title>
							<Text style={{marginTop: -8}}>Bacteria</Text>
							<Caption>Xanthomonas oryzae pv. oryzae</Caption>
						</View>
					</View>
				</View>
			</ScrollView>
		)
	}
}
							
const s = StyleSheet.create({
	title: {
		fontFamily: "Product Sans Bold",
		color: '#666',
		width: 250,
	},
	mainContainer: {
		paddingVertical: 24,
		paddingHorizontal: 16,
		flex: 1,
	},
	image: {
		width: 300,
		height: 250,
		opacity: .8,
		margin: 24,
		marginTop: -80
	},
	camera: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 16,
		margin: -24,
	},
	captureBtn: {
		flex: 0,
		backgroundColor: 'rgba(255, 255, 255, .8)',
		borderRadius: 80,
		padding: 12,
		marginTop: 24
	},
	modal: {
		width: WIDTH / 1.2,
		height: HEIGHT / 1.9,
		backgroundColor: '#fff',
		alignSelf: 'center',
		padding: 24,
		borderRadius: 16,
		overflow: 'hidden',
	},
	dragIndicator: {
		width: 40,
		height: 5,
		backgroundColor: 'rgba(0, 0, 0, .2)',
		borderRadius: 5,
		alignSelf: 'center',
		marginBottom: -12,
		marginTop: 12
	},
	loadingAnimation: {
		width: WIDTH / 1.5,
		marginTop: -80,
		marginBottom: -80,
		opacity: .8,
	},
	hint: {
		color: 'rgba(255, 255, 255, .8)',
		textShadowOffset: {width: 2, height: 2},
		textShadowRadius: 2,
		textShadowColor: '#666',
		fontSize: 18
	}
})