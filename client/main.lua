RegisterNUICallback('hideSelectPos', function(_, cb)
    SetNuiFocus(false, false)
    cb({})
end)

RegisterNetEvent('deluxe_notify_sendNotification')
AddEventHandler('deluxe_notify_sendNotification', function(notifyMessage, notifyInfo, notifyHeader, notifyDuration)
    if not notifyMessage or not notifyInfo then return end

    local data = {
        notifyMessage = notifyMessage,
        notifyInfo = notifyInfo, 
        notifyHeader = notifyHeader or nil,
        notifyDuration = notifyDuration
        }

        print(json.encode(data))

    SendNUIMessage({
        action = 'showNotification',
        data = data
    })
end)

---@param args first argument should be the notification type | example of what you should type in game: createnot info
RegisterCommand("createnot", function(source, args)
    if #args > 1 then 
        TriggerEvent('deluxe_notify_sendNotification', 'The correct usage is "createnot type"', 'error' , nil , 5000) 
        return
    end
    local notifyInfo = tostring(args[1])
    if not notifyInfo then return end

    --[[  You can replace nil with a custom string for header if you want , for example 'Police Arrest' . If you leave it to nil, it will show the notifyInfo as header ]]
    TriggerEvent('deluxe_notify_sendNotification', 'This is a test message', notifyInfo , nil , 5000) 
end)

RegisterCommand("notifypos", function(source, args)
    SetNuiFocus(true, true)
   SendNUIMessage({
    action = 'selectNotificationsPos'
   })
end)

--[[

    Usage CLIENT SIDE:

    TriggerEvent('deluxe_notify_sendNotification', 'This is a test message', 'police' , nil , 5000) 

    Usage SERVER SIDE:

    TriggerClientEvent('deluxe_notify_sendNotification', source, 'This is a test message', 'police' , nil , 5000)

]]
