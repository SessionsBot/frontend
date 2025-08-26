<script lang="ts" setup>
    // Imports
    // @ts-ignore
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { number, string, z } from 'zod'
    import { FormInstance, FormSubmitEvent } from '@primevue/forms';
    import { SessionRole } from '@sessionsbot/api-types';
    import { LetterTextIcon, SmilePlusIcon, UsersIcon } from 'lucide-vue-next';

    // PRICING PLANS - LIMITS:
    const maxRoleCapacity = ref(10)

    // Incoming Props:
    const props = defineProps<{
        scheduleRoles: SessionRole[]
    }>()

    // Outgoing Emits:
    const emits = defineEmits<{
        closePopover: []
        addRole: [SessionRole]
    }>()

    // New Role Form Ref:
    const newRoleFormRef = ref<FormInstance>();

    // Form Resolver:
    const resolver = zodResolver(
        z.object({
            roleName: string().trim().min(2).max(14),
            roleDescription: string().trim().min(5).max(60),
            roleEmoji: string().emoji().length(2),
            roleCapacity: number().min(1).max(maxRoleCapacity.value)
        }).superRefine((data, ctx) => {
            // Check duplicate role names:
            const roleNameExists = props.scheduleRoles.some(role => role.roleName.toLowerCase() == data.roleName.toLowerCase())
            if(roleNameExists) ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Duplicate role name',
                path: ['roleName']
            })
        })
    )

    const newRoleSubmit = (f:FormSubmitEvent) => {
        if(f.valid){ // Valid Submission
            // Get compiled role data
            const newRole = f.values
            // Add blank users[] to role
            newRole['users'] = []
            // Add role to static stack:
            props.scheduleRoles.push(newRole);
            emits('closePopover')

        } else { // Valid Submission
            // console.warn('INVALID', f)
            return
        }
    }

    // Define Expose:
    defineExpose({
        newRoleFormRef
    })


</script>

<template>
<Form v-slot="$form" ref="newRoleFormRef" :resolver="resolver" @submit="newRoleSubmit" class="flex flex-col gap-2 justify-center items-center">

    <!-- Role Name -->
    <IftaLabel>
        <InputText
        name="roleName"
        maxlength="14"
        fluid
        >
        </InputText>
        <label class="flex gap-0.75 items-center justify-center content-center"> 
            <LetterTextIcon :size="14" class="!inline !pt-0.25"/>
            <p class="!inline"> Role Name </p>
        </label>
    </IftaLabel>
    <Message v-if="$form.roleName?.invalid" severity="error" class="opacity-75 px-4" size="small" variant="simple">
        <ul class="flex flex-col gap-1">
            <li v-for="(error, index) of $form.roleName.errors" class="text-red-300 text-sm" :key="index"> {{ error.message }}
            </li>
        </ul>
    </Message>


    <!-- Role Description -->
    <IftaLabel>
        <InputText
        name="roleDescription"
        maxlength="60"
        fluid
        >
        </InputText>
        <label class="flex gap-0.75 items-center justify-center content-center"> 
            <LetterTextIcon :size="14" class="!inline !pt-0.25"/>
            <p class="!inline"> Role Description </p>
        </label>
    </IftaLabel>
    <Message v-if="$form.roleDescription?.invalid" severity="error" class="opacity-75 px-4" size="small" variant="simple">
        <ul class="flex flex-col gap-1">
            <li v-for="(error, index) of $form.roleDescription.errors" class="text-red-300 text-sm" :key="index"> {{ error.message }}
            </li>
        </ul>
    </Message>


    <!-- Role Emoji -->
    <IftaLabel>
        <InputText
        name="roleEmoji"
        maxlength="2"
        fluid
        >
        </InputText>
        <label class="flex gap-0.75 items-center justify-center content-center"> 
            <SmilePlusIcon :size="14" class="!inline !pt-0.25"/>
            <p class="!inline"> Role Emoji </p>
        </label>

        <Button 
            label="🏷️"
            title="Default Emoji"
            unstyled
            class="!absolute right-2 top-4.5 grayscale-75"
            @click="(e) => {newRoleFormRef.states['roleEmoji'].value = '💼'}"
        />

    </IftaLabel>
    <Message v-if="$form.roleEmoji?.invalid" severity="error" class="opacity-75 px-4" size="small" variant="simple">
        <ul class="flex flex-col gap-1">
            <li v-for="(error, index) of $form.roleEmoji.errors" class="text-red-300 text-sm" :key="index"> {{ error.message }}
            </li>
        </ul>
    </Message>


    <!-- Role Capacity -->
    <IftaLabel>
        <InputNumber
        name="roleCapacity"
        maxlength="2"
        fluid
        :max="10"
        :min="1"
        >
        </InputNumber>
        <label class="flex gap-0.75 items-center justify-center content-center"> 
            <UsersIcon :size="14" class="!inline !pt-0.25"/>
            <p class="!inline"> Role Capacity </p>
        </label>
    </IftaLabel>
    <Message v-if="$form.roleCapacity?.invalid" severity="error" class="opacity-75 px-4" size="small" variant="simple">
        <ul class="flex flex-col gap-1">
            <li v-for="(error, index) of $form.roleCapacity.errors" class="text-red-300 text-sm" :key="index"> {{ error.message }}
            </li>
        </ul>
    </Message>


    <!-- Submit/Reset Buttons -->
    <div class="flex flex-wrap flex-row gap-2 justify-center items-center">
        <Button
        @click="(e)=>newRoleFormRef.reset()" 
        unstyled
        class="bg-zinc-800 rounded-md hover:brightness-150 font-semibold text-sm text-zinc-300 transition-all p-2 px-3 cursor-pointer">
            Reset
        </Button>

        <Button 
        unstyled
        @click="(e)=>newRoleFormRef.submit()"
        class="bg-emerald-800 rounded-md hover:brightness-150 font-semibold text-sm text-zinc-300 transition-all p-2 px-3 cursor-pointer">
            Add Role
        </Button>
    </div>

</Form>
</template>