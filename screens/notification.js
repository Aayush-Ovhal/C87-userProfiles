import * as React from "react";
import {View, TouchableOpacity, StyleSheet, Text, FlatList, Image} from "react-native";
import firebase from "firebase";
import db from "../config";
import CustomHeader from "../components/CustomHeader";

export default class NotificationScreen extends React.Component{

    constructor(){
        super();
        this.state={
            emailId: firebase.auth().currentUser.email,
            allNotifications: [],
            doc_id: "",
            status: ""
        }
        this.notificationRef = null;
    }

    refNotifications=async()=>{
        this.notificationRef = db.collection("all_notifications")
        .where("notificationStatus", "==", "unread")
        .where("targetedUserId", "==", this.state.emailId).get()
        .then((snapshot)=>{
            var allNotifications = [];
            snapshot.docs.map((doc)=>{
                var notifications = doc.data();
                notifications["doc_id"] = doc.id;
                allNotifications.push(notifications);
                this.setState({
                    allNotifications: allNotifications
                })
            })
        })

        // db.collection("all_notifications").where("targetedUserId", "==", this.state.emailId).get()
        // .then((snapshot)=>{
        //     snapshot.forEach((doc)=>{
        //         this.setState({
        //             doc_id: doc.id,
        //             status: doc.data().notificationStatus
        //         })
        //     })
        //     console.log(this.state.status)
        // })
    }

    // updateStatus=(status)=>{
    //     db.collection("all_notifications").doc(this.state.doc_id)
    //     .update({
    //         "notificationStatus": status
    //     })
    // }

    componentDidMount(){
        this.refNotifications();
    }

    componentWillUnmount(){
        this.notificationRef = null;
    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: "#D6D6D6"}}>
                <View style={{flex: 0.1}}>
                   <CustomHeader title="Notifications" navigation={this.props.navigation}/>
                </View>
                <View style={{flex: 0.9}}>
                    {
                        this.state.allNotifications.length == 0 ?(
                           <View style={{flex: 1}}>
                                <Image source={require("../assets/Notification.png")}/>
                           </View>
                        ):(
                            <View style={{flex: 1}}>
                                <FlatList
                                  keyExtractor={(item, index)=>index.toString()}
                                  data={this.state.allNotifications}
                                  renderItem={({item})=>(
                                      <View style={{borderBottomWidth: 2}}>
                                         <Text 
                                           style={{fontSize: 25, fontWeight: "600", marginLeft: 20, marginBottom: 10}}>
                                             {item.message}
                                         </Text>

                                         {/* <TouchableOpacity
                                          onPress={()=>{this.updateStatus(this.state.status == "unread" ? "read" : "unread"); }}
                                          style={styles.ruButton}
                                         >
                                             <Image source={require(this.state.status == "unread" ? "../assets/open-email.png" : "../assets/envelope.png")} style={{width: 50, height: 50}}/>
                                         </TouchableOpacity> */}
                                      </View>
                                  )}
                                />
                            </View>
                        )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ruButton: {
        marginLeft: 1300,
        marginTop: -40,
        width: 50,
        height: 50
    }
})