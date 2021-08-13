import React from 'react'
import {
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	ToastAndroid
} from 'react-native'
import {
	View,
	Text,
	Title,
	NavigationBar,
	Button,
	Caption,
	Image,
	Divider,
	Row,
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
import Animated from 'react-native-reanimated'

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
			isFetching: false,
			hasCameraPermission: false,
			isLoadingModel: false,
			bottomSheetAnimation: new Animated.Value(0),
			photoUri: null,
			numOfLines: 5,
			diseaseInfo: {},
		}
		
		this.sheet = React.createRef()
		this.model = null
	}
	
	componentDidMount() {
		this.checkCameraPermission()
		// this.checkTf()
		this.sheet.current.snapTo(0)
	}
	
	checkCameraPermission = async () => {
		const { status } = await Camera.requestPermissionsAsync()
		this.setState({hasCameraPermission: status === 'granted'})
	}
	
	checkTf = async () => {
		this.setState({isLoadingModel: true}, async () => {
			// await tf.setBackend('cpu')
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
		const fileUri = this.state.photoUri
		const imgB64 = await FileSystem.readAsStringAsync(fileUri, {
			encoding: FileSystem.EncodingType.Base64,
		})
		const imageBuffer = tf.util.encodeString(imgB64, 'base64').buffer
		const raw = new Uint8Array(imageBuffer)
		const imageTensor = decodeJpeg(raw)
		const imageResized = await tf.image.resizeBilinear(imageTensor, [224, 224])
		const image = await imageResized.reshape([1, 224, 224, 3,])
		
		const prediction = await this.model.predict(image)
		const predicted_id = tf.argMax(prediction, 1).dataSync()[0] + 1
		
		this.fetchDiseaseInfo(predicted_id)
	}

	fetchDiseaseInfo = async id => {
		this.setState({isFetching: true})

		try {
			let res = await fetch(`https://rice-disease-backend.herokuapp.com/disease/${id}`)
			res = await res.json()

			this.setState({diseaseInfo: res})
		} catch (e) {
			ToastAndroid.show('Failed to fetch disease data')
		}

		this.setState({isFetching: false})
	}

	renderBottomSheet = () => (
		<ScrollView style={{minHeight: HEIGHT, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', paddingBottom: 24}}>
			<Animated.View style={[s.dragIndicator, {
				top: this.state.bottomSheetAnimation.interpolate({
					inputRange: [0, 1],
					outputRange: [-10, 0]
				})
			}]} />
			<View>
				<Animated.Text
					style={{
						textAlign: 'center',
						fontFamily: 'Product Sans Bold',
						fontSize: 16,
						color: '#666',
						marginTop: this.state.bottomSheetAnimation.interpolate({
							inputRange: [0, 1],
							outputRange: [0, 38]
						}),
						marginBottom: this.state.bottomSheetAnimation.interpolate({
							inputRange: [0, 1],
							outputRange: [-24, -12]
						}),
						opacity: this.state.bottomSheetAnimation.interpolate({
							inputRange: [0, 1],
							outputRange: [0, 1.5]
						})
					}}
				>
					SWIPE TO SEE DISEASE DETAIL
				</Animated.Text>
				{this.state.photoUri ? (
					<Animated.View style={{
						opacity: this.state.bottomSheetAnimation.interpolate({
							inputRange: [0, 1],
							outputRange: [1, -1]
						}),
					}}>
						<Image source={{uri: this.state.photoUri}} styleName="large-banner" style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}} />
					</Animated.View>
				) : null}

				<Animated.View style={{flexDirection: 'row', alignItems: 'center', marginTop: this.state.bottomSheetAnimation.interpolate({
					inputRange: [0, 1],
					outputRange: [-16, -WIDTH / 1.5]
				})}}>
					<Animated.View style={{
						left: this.state.bottomSheetAnimation.interpolate({
							inputRange: [0, .51],
							outputRange: [16, (WIDTH / 2) - 112]
						})
					}}>
						{/* <LottieView
							source={
								this.state.diseaseInfo?.brief?.type == "Bacteria" ? require('./assets/lottie/bacteria.json')
								: (this.state.diseaseInfo?.brief?.type == "Virus" ? require('./assets/lottie/virus.json') : require('./assets/lottie/fungi3.json'))
							}
							autoPlay
							style={{
								width: 100,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						/> */}
						<Image
							source={
								this.state.diseaseInfo?.brief?.type == "Bacteria" ? require('./assets/images/bacteria.png')
								: (this.state.diseaseInfo?.brief?.type == "Virus" ? require('./assets/images/virus.png') : require('./assets/images/fungus.png'))
							}
							style={{width: 100, alignItems: 'center', justifyContent: 'center'}}
						/>
					</Animated.View>
					<Animated.View
						style={{
							alignItems: 'flex-start',
							opacity: this.state.bottomSheetAnimation.interpolate({
								inputRange: [0, 1],
								outputRange: [1, -1]
							}),
							marginLeft: 16
						}}
					>
						<Text style={{fontFamily: 'Product Sans Bold', fontSize: 18,}}>{this.state.diseaseInfo?.brief?.disease_name}</Text>
						<Text>{this.state.diseaseInfo?.brief?.type}</Text>
						<Caption style={{fontStyle: 'italic'}}>{this.state.diseaseInfo?.brief?.latin}</Caption>
					</Animated.View>
				</Animated.View>

				<View style={{paddingHorizontal: 24, marginTop: -24}}>
					<View>
						<Text style={{textAlign: 'justify', fontFamily: 'Product Sans', fontSize: 16}} numberOfLines={this.state.numOfLines}>
							{'\t'}{'\t'}{'\t'}{this.state.diseaseInfo?.brief?.description}
						</Text>
						{this.state.numOfLines > 0 ? (
							<TouchableOpacity onPress={() => this.setState({numOfLines: 0})}><Text style={{color: '#3490dc'}}>Read more</Text></TouchableOpacity>
						) : null}
					</View>

					<View style={{marginTop: 24}}>
						<Text style={s.diseaseSectionTitle}>Symptoms</Text>
						<Divider styleName="line" style={s.divider} />
						{this.state.diseaseInfo?.symptoms?.map((val, i) => (
							<View style={{flexDirection: 'row'}}>
								<Icon name='check-circle' style={{marginTop: 7}} />
								<Text key={val + i} style={s.textPoint}>{val.symptom_description}</Text>
							</View>
						))}
					</View>	

					<View style={{marginTop: 24}}>
						<Text style={s.diseaseSectionTitle}>Treatments</Text>
						<Divider styleName="line" style={s.divider} />
						{this.state.diseaseInfo?.treatments?.map((val, i) => (
							<View style={{flexDirection: 'row'}}>
								<Icon name='check-circle' style={{marginTop: 7}} />
								<Text key={val + i} style={s.textPoint}>{val.treatment_description}</Text>
							</View>
						))}
					</View>

					<View style={{marginTop: 24}}>
						<Text style={s.diseaseSectionTitle}>Chemical Control</Text>
						<Divider styleName="line" style={s.divider} />
						{this.state.diseaseInfo?.cures?.length > 0 ? this.state.diseaseInfo?.cures?.map((val, i) => (
							<Row style={{backgroundColor: 'rgba(0, 0, 0, .02)', marginHorizontal: -24, marginBottom: 8}}>
								<View styleName="v-center" style={{flex: 0, paddingRight: 24}}>
									{/* <Icon name="feather" size={32} style={{marginLeft: -8}} /> */}
									<Image source={require('./assets/images/chemical.png')} style={{width: 45, height: 45, marginLeft: 16}} />
								</View>
								<View styleName="vertical v-center">
									<Caption>{val.chemical_type}</Caption>
									<Text style={{fontFamily: 'Product Sans Bold', fontSize: 16, width: '92%', marginTop: -4}}>{val.chemical_name}</Text>
								</View>
							</Row>
						)) : <Text style={{fontFamily: 'Product Sans', fontSize: 16}}>Sorry, there are no known effective chemical control for this kind of disease.</Text>}
					</View>
				</View>
			</View>
		</ScrollView>
	)
	
	render() {
		return (
			<>
				<LoadingModal show={this.state.isLoading} />
				<LoadingModal show={this.state.isFetching} type="fetching" />
				<View style={{flex: 1}}>
					<CameraModal
						showCamera={this.state.showCamera}
						hideSelf={() => this.setState({showCamera: false})}
						showSheet={() => this.sheet.current.snapTo(1)}
						setLoading={state => this.setState({isLoading: state})}
						model={this.model}
						predict={() => this.predict()}
						setPhoto={uri => this.setState({photoUri: uri})}
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
					renderContent={() => this.renderBottomSheet()}
					initialSnap={2}
					snapPoints={['100%', 200, 0]}
					callbackNode={this.state.bottomSheetAnimation}
					enabledContentTapInteraction={false}
					onCloseEnd={() => this.setState({diseaseInfo: {}})}
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
			this.props.setPhoto(data.uri)
			await this.props.predict()
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
		marginTop: -80,
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
	},
	diseaseSectionTitle: {
		fontSize: 18,
		fontFamily: 'Product Sans Bold',
		color: '#666',
	},
	textPoint: {
		fontFamily: 'Product Sans',
		fontSize: 16,
		marginLeft: 8,
		width: '94%',
	},
	divider: {
		marginHorizontal: -16,
		marginBottom: 8,
		marginTop: 4,
	}
})