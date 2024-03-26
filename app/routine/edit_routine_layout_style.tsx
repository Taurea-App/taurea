import { StyleSheet } from 'react-native';

export const editRoutineLayoutStyle = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        margin: 10,
      },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        width   : '100%',
      },
      description: {
        fontSize: 18,
        marginBottom: 10,
        color: '#666666',
      },
      exerciseList: {
        width: '100%',
        // padding: 10,
        // backgroundColor: '#f9f9f9',
        // borderRadius: 10,
        marginBottom: 5,
    },
    exerciseListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        // backgroundColor: '#f9f9f9',
        width: '100%',
        // borderRadius: 10,
        marginBottom: 5,
    },
    exerciseListItemName: {
        fontSize: 16,
        width: '40%',
    },
    exerciseListItemQuantity: {
        fontSize: 16,
        width: '20%',
    },
    searchBar: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        width: '100%',
        borderRadius: 10,
    },

    newExerciseForm: {
        alignItems: 'center',
        // backgroundColor: '#f9f9f9',
        borderRadius: 10,
        margin: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 10,
    },
    newExercisePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    exerciseSelect: {
        width: '45%',
        textAlign: 'center',
    },
    quantityInput: {
        width: '25%',
    },
    unitSelect: {
        width: '30%',
    },

    exerciseSelectModalView: {
        // marginTop: 100,
        // backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        // shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '100%',
    },
    button: {
        alignItems: 'center',
        padding: 10,
        width: '100%',
    },
    exerciseSelectItem: {
        fontSize: 16,
    },
    pickerItem: {
        fontSize: 12,
        },
    showAddExerciseButton: {
        padding: 10,
        // backgroundColor: '#50f950',
        borderRadius: 10,
        width: '100%',
        // alignItems: 'flex-end',
        // justifyContent: 'center',
    },
    saveButton: {
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addExerciseButton: {
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

